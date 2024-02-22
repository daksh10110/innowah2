var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("express-async-errors");
var cors = require("cors");
const authRouter = require("./controllers/authController");
const chatController = require("./controllers/chatController");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/auth", authRouter);
app.use("/chats", chatController);

app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;
