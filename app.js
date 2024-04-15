const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors"); //跨域

const app = express();
//使用koa-body中间件

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//跨域问题
app.use(
  cors({
    origin: "*",
  }),
);

//路由使用
//路由管理
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users.route");
const postsRouter = require("./routes/posts.router");
const testRouter = require("./routes/test.router");
const adminRouter = require("./routes/admin.router");
const likeRouter = require("./routes/like.router");
const tagRouter = require("./routes/tag.router");
app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/posts", postsRouter);
app.use("/test", testRouter);
app.use("/admin", adminRouter);
app.use("/like", likeRouter);
app.use("/tag", tagRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
