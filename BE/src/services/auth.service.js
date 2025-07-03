const authModal = require("../modal/auth.modal");
const fs = require("fs");
const GenerateRandomstring = require("../utils/helper");
const SendMail = require("./email.service");
const { DateTime } = require("luxon");
const Joi = require("joi");
class AuthService {
  register = async (req) => {
    try {
      let data = req.body;
      data.name = data.name;
      data.activationToken = GenerateRandomstring(100);
      return data;
    } catch (exception) {
      console.log(exception);
      throw exception;
    }
  };

  createUser = async (data) => {
    try {
      let user = new authModal(data);
      let response = await user.save();

      return response;
    } catch (exception) {
      console.log(exception);

      throw exception;
    }
  };

  findUserByActivationToken = async (filter, data) => {
    try {
      const response = await authModal.updateOne(filter, { $set: data });
      console.log("Response", response);

      return response;
    } catch (exception) {
      throw exception;
    }
  };

  findUserbyEmail = async (email) => {
    try {
      const response = await authModal.findOne({ email: email });

      return response;
    } catch (exception) {
      throw exception;
    }
  };

  updateForgotPassToken = (id, data) => {
    try {
      const response = authModal.findByIdAndUpdate(id, {
        $set: data,
      });
      return response;
    } catch (exception) {
      throw exception;
    }
  };

  getSingleUserByFilter = async (filter) => {
    try {
      let response = await authModal.findOne(filter);
      return response;
    } catch (exception) {
      throw exception;
    }
  };

  notifyForgotPassword = (user) => {
    try {
      console.log("User", user);

      let response = SendMail(
        user.email,
        "Reset your password",
        `<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px"
>
  <tr>
    <td align="center">
      <table
        width="600"
        cellpadding="0"
        cellspacing="0"
        style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)"
      >
        <!-- Header -->
        <tr>
          <td style="background-color: #2a7b9b; padding: 20px; text-align: center">
            <h2 style="color: #ffffff; margin: 0; font-size: 22px">
              Password Reset Request
            </h2>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 30px">
            <p style="font-size: 16px; color: #333333">
              <strong>Dear ${user.name},</strong>
            </p>
            <p style="font-size: 16px; color: #333333">
              We received a request to reset your password. If you made this request, click the button below to proceed. If not, please ignore this email.
            </p>

            <!-- Button -->
            <div style="text-align: center; margin: 30px 0">
              <a
                href="${process.env.FRONTEND_URL}updatepass/${user.forgotPassToken}"
                style="
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #2a7b9b;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                "
              >
                Reset Password
              </a>
            </div>

            <!-- Fallback Link -->
            <p style="font-size: 14px; color: #666666">
              If the button above doesn't work, copy and paste the following link into your browser:
            </p>
            <p style="font-size: 14px; color: #2a7b9b; word-break: break-all">
              ${process.env.FRONTEND_URL}updatepass/${user.forgotPassToken}
            </p>

            <p style="font-size: 14px; color: #333333; margin-top: 20px">
              <strong>Note:</strong> This link is valid for only <strong>1 hour</strong>.
            </p>

            <p style="font-size: 16px; color: #333333; margin-top: 40px">
              Regards,<br />
              <strong>noreply@gmail.com</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td
            style="background-color: #f4f4f4; padding: 15px 30px; text-align: center; font-size: 12px; color: #999999"
          >
            Please do not reply to this email. This is an automated message.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`
      );
      return response;
    } catch (exception) {
      throw exception;
    }
  };

  verifyToken = async (token) => {
    try {
      if (!token) {
        throw "Forgot password Token not provided";
      }

      let user = await this.getSingleUserByFilter({ forgotPassToken: token });

      let NowTime = DateTime.now();

      if (user.expiryTime < NowTime) {
        throw "Your token is expired";
      }
      return user;
    } catch (exception) {
      throw exception;
    }
  };

  UpdatePasswordbyforgotPass = async (filter, password) => {
    try {
      const response = await authModal.updateOne(filter, {
        password: password,
      });
      return response;
    } catch (exception) {
      throw exception;
    }
  };

  UpdatePassword = async (id, password) => {
    try {
      const response = authModal.findByIdAndUpdate(id, {
        password: password,
        forgotPassToken: null,
      });
      return response;
    } catch (exception) {
      throw exception;
    }
  };

  resetPassword = async (password) => {
    try {
      let rules = Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
        confirmPassword: Joi.string().required().valid(Joi.ref("newPassword")),
      });
      let response = await rules.validateAsync(password);
      return response;
    } catch (error) {
      throw error;
    }
  };

  findUserById = async (id) => {
    try {
      let response = await authModal.findById(id);
      return response;
    } catch (exception) {
      throw exception;
    }
  };
}

const authSrv = new AuthService();
module.exports = authSrv;
