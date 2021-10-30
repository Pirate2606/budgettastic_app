// require("dotenv").config();  // PLEASE UNCOMMENT THIS IF YOU ARE RUNNING IT LOCALLY
require("./db/mongoose");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const app = express();
const passport = require("passport");
const userRouter = require("./routers/user");

app.use(express.json()); // for parsing application/json
app.use(cookieParser());

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(passport.initialize());
app.use(passport.session());

// File uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
    cookieSession({
        name: "Maytrix",
        keys: ["key1", "key2"],
    })
);

const port = process.env.PORT;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");

// Setup ejs engine
app.set("view engine", "ejs");
app.set("views", viewsPath);

// Setup static directory to serve`
app.use(express.static(publicDirectoryPath));

app.use(userRouter);

app.get("/*", (req, res) => {
    res.render("404");
});

app.listen(port, function () {
    console.log("Server started on port " + port);
});
