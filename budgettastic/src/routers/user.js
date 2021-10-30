const { unlink } = require("fs"); // to delete the img after uploading to cloud.
require("../oauth/google");
require("../oauth/github");
const path = require("path");
const fetch = require("node-fetch");
const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const Invoice = require("../models/invoice");
const auth = require("../middleware/auth");
const passport = require("passport");
const multer = require("multer");
const imgbbUploader = require("imgbb-uploader");
const jwt = require("jsonwebtoken");
const ocr = require("../utils/budgettastic-api");
const get_account_holder_id = require("../utils/account_holder_id");

const shared_data = require("../shared-data/shared-vars");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },

    filename: function (req, file, cb) {
        cb(
            null,
            new Date().toISOString().replace(/:/g, "-") + file.originalname
        );
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024,
    },
    fileFilter: function (_req, file, cb) {
        checkFileType(file, cb);
    },
});

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png/;
    // Check ext
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        shared_data.valid_file_type = true;
        return cb(null, true);
    } else {
        shared_data.valid_file_type = false;
        cb(null, null);
    }
}

router.get("/", async (req, res) => {
    const token = req.cookies.jwt;

    if (token == null) {
        shared_data.user_is_authenticated = false;
    } else {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });

        if (!user) {
            shared_data.user_is_authenticated = false;
        } else {
            shared_data.user_is_authenticated = true;
        }
    }

    res.render("home", {
        title: "Budgettastic | Home",
        shared_data,
    });
});

router.get("/add-invoice", (req, res) => {
    if (!shared_data.user_is_authenticated) {
        res.redirect("/signin");
    } else {
        res.render("add-invoice", {
            title: "Budgettastic | Add Invoice",
            shared_data,
        });
    }
});

router.post(
    "/add-invoice",
    auth,
    upload.single("invoice-image"),
    async (req, res) => {
        shared_data.invoice_details = {};

        if (shared_data.valid_file_type === false) {
            res.redirect("/add-invoice");
        } else if (req.user.fname === "*_*") {
            res.redirect("/register");
        } else {
            const user = req.user;
            const invoice = new Invoice();

            invoice.category = req.body.category;
            invoice.customer_id = user._id;

            const cloud_img = await imgbbUploader(
                process.env.FILEBB_API_KEY,
                req.file.path
            );

            if (cloud_img) {
                unlink(req.file.path, (err) => {
                    if (err) throw err;
                });

                invoice.invoice_image = cloud_img.url;
            }

            try {
                await invoice.save();
            } catch (e) {
                res.status(400).send(e);
            }

            const expenses = user[invoice.category];

            ocr(
                invoice.invoice_image,
                invoice.category,
                user.monthly_income,
                expenses,
                async (error, data) => {
                    if (error) {
                        console.log(error);
                    } else {
                        user[invoice.category] = data.new_expense;
                        invoice.cost = data.total;

                        shared_data.invoice_details = data;

                        res.redirect("/summary");

                        await user.save();
                        await invoice.save();
                    }
                }
            );
        }
    }
);

router.get("/summary", (req, res) => {
    res.render("summary", {
        title: "Budgettastic | Invoice Summary",
        shared_data,
    });
});

router.get("/about", (req, res) => {
    res.render("aboutus", {
        title: "Budgettastic | About Us",
        shared_data,
    });
});

router.get("/contact", (req, res) => {
    res.render("contactus", {
        title: "Budgettastic | Contact Us",
        shared_data,
    });
});

router.get("/signin", (req, res) => {
    if (shared_data.user_is_authenticated) {
        res.redirect("/");
    } else {
        res.render("signin", {
            title: "Budgettastic | Log In",
            shared_data,
        });
    }
});

router.post("/signin", async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );

        if (shared_data.valid_user == false) {
            res.redirect("/signin");
        } else {
            const token = await user.generateAuthToken();

            res.cookie("jwt", token, {
                httpOnly: true,
                secure: false, // !!!!!------ MAKE IT SECURE BEFORE HOSTING --------!!!!!!
            });

            shared_data.user_is_authenticated = true;

            res.redirect("/");
        }
    } catch (e) {
        res.status(400).send();
    }
});

router.get("/signup", (req, res) => {
    if (shared_data.user_is_authenticated) {
        res.redirect("/");
    } else {
        res.render("signup", {
            title: "Budgettastic | Sign Up",
            shared_data,
        });
    }
});

router.post("/signup", async (req, res) => {
    shared_data.email_flag = false;

    const re =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!re.test(req.body.password)) {
        shared_data.strong_password = false;
        res.redirect("/signup");
    } else {
        shared_data.strong_password = true;

        const user = new User(req.body);

        const existing_user = await User.findOne({ email: user.email });

        if (existing_user) {
            shared_data.email_flag = true;
            res.redirect("/signup");
        } else {
            try {
                await user.save();
                // sendWelcomeEmail(user.email, user.name);
                const token = await user.generateAuthToken();

                res.cookie("jwt", token, {
                    httpOnly: true,
                    secure: false,
                });

                shared_data.user_is_authenticated = true;

                res.status(201).redirect("/register"); // REDIRECT TO REGISTRATION FORM AFTER SIGNUP
            } catch (e) {
                res.status(400);
            }
        }
    }
});

router.get("/history", auth, async (req, res) => {
    const user = req.user;

    const invoices = await Invoice.find({ customer_id: user._id });

    res.render("history", {
        title: "Budgettastic | History",
        shared_data,
        invoices,
    });
});

router.get("/register", auth, async (req, res) => {
    const user = req.user;

    if (!(user.fname == "*_*")) {
        // ALREADY REGISTERED USERS NOT ALLOWED TO ACCESS /register
        res.redirect("/");
    } else {
        res.render("registration-form", {
            title: "Budgettastic | Register",
            email: user.email,
            shared_data,
        });
    }
});

router.post("/register", auth, async (req, res) => {
    const requestedUpdates = Object.keys(req.body);
    const allowedUpdates = [
        "fname",
        "lname",
        "monthly_income",
        "family_members",
        "phone",
    ];

    const isValidOperation = requestedUpdates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
        const user = req.user;
        requestedUpdates.forEach((update) => (user[update] = req.body[update]));

        await user.save();

        shared_data.user_is_authenticated = true;

        res.status(201).redirect("/");
    } catch (e) {
        res.status(400).send(e);
    }
});


// GOOGLE OAUTH

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/signup" }),
    async function (req, res) {
        const user = req.user;
        const token = await user.generateAuthToken();

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: false,
        });

        shared_data.user_is_authenticated = true;

        res.status(201).redirect("/register"); // REDIRECT TO REGISTRATION FORM AFTER SIGNUP
    }
);

// GITHUB OAUTH

router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: "/signup" }),

    async function (req, res) {
        const user = req.user;
        const token = await user.generateAuthToken();

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: false,
        });

        shared_data.user_is_authenticated = true;

        res.status(201).redirect("/register"); // REDIRECT TO REGISTRATION FORM AFTER SIGNUP
    }
);

router.get("/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();

        res.redirect("/");
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
