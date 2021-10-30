const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var findOrCreate = require("mongoose-findorcreate");

const shared_data = require("../shared-data/shared-vars");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: false,
            trim: true,
            default: "NONAME",
        },

        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Email is invalid!");
                }
            },
        },

        password: {
            type: String,
            trim: true,
            minlength: 6,
            default: "NOPASS",
        },

        fname: {
            type: String,
            default: "*_*",
            required: true,
            trim: true,
        },

        lname: {
            type: String,
            default: "*_*",
            required: true,
            trim: true,
        },

        monthly_income: {
            type: Number,
            default: 0,
            required: true,
            trim: true,
        },

        family_members: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error("family members count must be positive!");
                }
            },
            required: true,
        },

        phone: {
            type: Number,
            default: 0,
            required: true,
        },

        balance: {
            type: Number,
            default: 10,
            required: true,
        },

        food: {
            type: Number,
            default: 0,
        },

        green_grocery: {
            type: Number,
            default: 0,
        },

        hotels: {
            type: Number,
            default: 0,
        },

        alcohol: {
            type: Number,
            default: 0,
        },

        clothes: {
            type: Number,
            default: 0,
        },

        house: {
            type: Number,
            default: 0,
        },

        health: {
            type: Number,
            default: 0,
        },

        education: {
            type: Number,
            default: 0,
        },

        special_occasion: {
            type: Number,
            default: 0,
        },

        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
    },

    {
        timestamps: true,
    }
);

userSchema.virtual("invoices", {
    ref: "Invoice",
    localField: "_id",
    foreignField: "customer",
});

// GENERATE AUTH TOKEN USING JWT
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "zetahackssecretkey");

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        shared_data.valid_user = false;
        return undefined;
        // throw new Error("Unable to login!");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        shared_data.valid_user = false;
        return undefined;
        // throw new Error("Unable to login!");
    }

    shared_data.valid_user = true;
    return user;
};

// HASH PLAIN TEXT PASSWORDS
userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

module.exports = User;
