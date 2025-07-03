const authCtrl = require("../src/controller/auth.controller");
const Uploader = require("../src/middleware/uploader");
const { bodyValidator } = require("../src/middleware/validator");
const {
  UserRegisterValidation,
  CreatePassword,
  loginValidation,
  forgotPass,
  UpdatePassword,
} = require("../src/utils/validator/auth.validate");

const Authroutes = require("express").Router();

Authroutes.post(
  "/register",
  // Uploader.array("image", 5),
  bodyValidator(UserRegisterValidation),
  authCtrl.register
);
Authroutes.post(
  "/createpassword/:token",
  bodyValidator(CreatePassword),
  authCtrl.UserActivate
);
Authroutes.post("/me");
Authroutes.post("/login", bodyValidator(loginValidation), authCtrl.login);
Authroutes.post(
  "/forgotpassemailsend",
  bodyValidator(forgotPass),
  authCtrl.forgotPasswordnotification
);
Authroutes.post(
  "/forgotpass/:token",
  bodyValidator(CreatePassword),
  authCtrl.UpdatePasswordbyForgotPass
);
Authroutes.post(
  "/resetPassword/:id",
  bodyValidator(UpdatePassword),
  authCtrl.resetPassword
);
Authroutes.get("/password-status", authCtrl.getPasswordStatus);
Authroutes.post(
  "/changepassword",
  bodyValidator(UpdatePassword),
  authCtrl.changePassword
);
// Authroutes.post("/resetpassword", authCtrl.resetPassword);
module.exports = Authroutes;
