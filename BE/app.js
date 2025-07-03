const express = require("express");
require("./config/mongoose.config");
const Routes = require("./router");
const app = express();
const helmet = require("helmet");

const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/v1", Routes);

app.use((req, res, next) => {
  next({
    data: "",
    msg: "Page not Found",
    code: 404,
    meta: null,
  });
});
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "http://localhost:5173"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
    },
  })
);

app.use((error, req, res, next) => {
  const data = error.data || "Data not found";
  const msg = error.msg || "Resource not found";
  const statusCode = error.code || 500;
  res.status(statusCode).json({
    data: data,
    msg: msg,
    code: statusCode,
    meta: null,
  });
});

app.listen(3005, "localhost", (err) => {
  if (err) {
    console.log("Error while listening to server");
  } else {
    console.log("Server is listening to port : ", 3005);
    console.log("Press CTRL + C to disconnect server");
  }
});
