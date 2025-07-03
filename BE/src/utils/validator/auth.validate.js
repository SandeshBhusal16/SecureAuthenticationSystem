const Joi = require("joi");

const UserRegisterValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),
  phone: Joi.number(),
  role: Joi.string().default("customer"),
});

const CreatePassword = Joi.object({
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const UpdatePassword = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotPass = Joi.object({
  email: Joi.string().email().required(),
});
module.exports = {
  UserRegisterValidation,
  CreatePassword,
  UpdatePassword,
  loginValidation,
  forgotPass,
};
