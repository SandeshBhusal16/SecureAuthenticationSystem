const Routes = require("express").Router();
const Authroutes = require("./auth.routes");

Routes.use("/auth", Authroutes);

module.exports = Routes;
