const authSrv = require("../services/auth.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SendMail = require("../services/email.service");
const { DateTime } = require("luxon");
const GenerateRandomstring = require("../utils/helper");
const authModal = require("../modal/auth.modal");

const loginAttempts = {}; // Global for in-memory storage (can be replaced with Redis/Mongo)

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 60 * 1000; // 60 seconds
class AuthController {
  register = async (req, res, next) => {
    try {
      let data = await authSrv.register(req);

      // Check if user already exists before creating
      let userExists = await authSrv.findUserbyEmail(data.email);
      if (userExists) {
        return res.status(409).json({
          data: null,
          msg: "User already exists with this email",
          code: 409,
        });
      }

      let response = await authSrv.createUser(data);

      SendMail(
        data.email,
        "Activate Your Ecom Account",
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
        <tr>
          <td style="background-color: #2a7b9b; padding: 20px; text-align: center">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px">
              Welcome to Ecom
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px">
            <p style="font-size: 16px; color: #333333">
              <strong>Dear ${data.name},</strong>
            </p>
            <p style="font-size: 16px; color: #333333">
              Thank you for registering your account with us. To activate your account and get started, please click the button below:
            </p>
            <div style="text-align: center; margin: 30px 0">
              <a
                href="http://localhost:5173/createpassword/${data.activationToken}"
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
                Activate My Account
              </a>
            </div>
            <p style="font-size: 14px; color: #666666">
              If the button above doesn't work, please copy and paste the following URL into your browser:
            </p>
            <p style="font-size: 14px; color: #2a7b9b; word-break: break-all">
              http://localhost:5173/createpassword/${data.activationToken}
            </p>
            <p style="font-size: 16px; color: #333333; margin-top: 40px">
              Regards,<br />
              <strong>The Ecom 19 Team</strong>
            </p>
          </td>
        </tr>
        <tr>
          <td
            style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #999999"
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

      res.json({
        data: response,
        msg: "User Registered successfully.",
        code: 200,
      });
    } catch (error) {
      // Handle MongoDB duplicate key error
      if (error.code === 11000 || error.name === "MongoError") {
        return res.status(409).json({
          data: null,
          msg: "User already exists with this email",
          code: 409,
        });
      }

      next({
        data: null,
        msg: error.message || error,
        code: 500,
      });
    }
  };

  UserActivate = async (req, res, next) => {
    try {
      let token = req.params.token;
      let data = req.body;

      let password = bcrypt.hashSync(data.password, 10);

      let response = await authSrv.findUserByActivationToken(
        {
          activationToken: token,
        },
        {
          activationToken: null,
          status: "active",
          password: password,
          passwordCreatedAt: new Date(),
        }
      );

      if (response.modifiedCount) {
        res.json({
          data: "",
          msg: "Password created successfully",
          code: 200,
          meta: null,
        });
      } else {
        throw "Activation token is broken";
      }
    } catch (error) {
      next({
        msg: error,
        code: 401,
      });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Initialize or fetch attempt info
      const attempt = loginAttempts[email] || { count: 0, lockUntil: null };

      // Check if locked
      if (attempt.lockUntil && Date.now() < attempt.lockUntil) {
        const remainingTime = Math.ceil(
          (attempt.lockUntil - Date.now()) / 1000
        );
        return res.status(429).json({
          msg: `Too many failed attempts. Try again in ${remainingTime} seconds.`,
        });
      }

      // Find user
      const userDetails = await authSrv.findUserbyEmail(email);
      if (!userDetails) {
        attempt.count += 1;
        if (attempt.count >= MAX_ATTEMPTS) {
          attempt.lockUntil = Date.now() + LOCK_TIME;
          attempt.count = 0;
        }
        loginAttempts[email] = attempt;
        return res.status(401).json({ msg: "Credential does not match" });
      }

      // Check account status
      if (userDetails.status !== "active") {
        return res
          .status(403)
          .json({ msg: "Check email to activate your account" });
      }

      // Check password
      const passCheck = bcrypt.compareSync(password, userDetails.password);
      if (!passCheck) {
        attempt.count += 1;
        if (attempt.count >= MAX_ATTEMPTS) {
          attempt.lockUntil = Date.now() + LOCK_TIME;
          attempt.count = 0;
        }
        loginAttempts[email] = attempt;
        return res.status(401).json({ msg: "Credential does not match" });
      }

      // On successful login, reset attempts
      loginAttempts[email] = { count: 0, lockUntil: null };

      // Generate JWT tokens
      const accessToken = jwt.sign({ userDetails }, process.env.JWTSECRETE, {
        expiresIn: "1 days",
      });

      const refreshToken = jwt.sign({ userDetails }, process.env.JWTSECRETE, {
        expiresIn: "3 days",
      });

      // Check if password change is required (180+ days)
      const passwordDate =
        userDetails.passwordChangedAt ||
        userDetails.passwordCreatedAt ||
        userDetails.createdAt;
      const daysSinceLastChange = Math.floor(
        (Date.now() - new Date(passwordDate)) / (1000 * 60 * 60 * 24)
      );
      const passwordChangeRequired = daysSinceLastChange <= 180;

      return res.status(200).json({
        msg: "User logged in successfully",
        data: {
          accessToken,
          refreshToken,
          passwordChangeRequired,
          code: 200,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  forgotPasswordnotification = async (req, res, next) => {
    try {
      const { email } = req.body;

      // Step 1: Find user by email
      const user = await authSrv.findUserbyEmail(email);

      if (!user) {
        throw "User not found";
      }

      // Step 2: Generate token and expiry
      const forgotPassToken = GenerateRandomstring(100);
      const expiryTime = DateTime.now()
        .plus({ hours: 1 })
        .toFormat("yyyy-MM-dd HH:mm:ss");

      // Step 3: Update DB with new token and expiry
      await authSrv.updateForgotPassToken(user._id, {
        forgotPassToken,
        expiryTime,
      });

      // Step 4: Update the in-memory user object so it has the new values
      user.forgotPassToken = forgotPassToken;
      user.expiryTime = expiryTime;

      // Step 5: Notify user with updated object
      await authSrv.notifyForgotPassword(user);

      res.json({
        data: user.email,
        msg: "Password reset email sent successfully.",
      });
    } catch (error) {
      next({
        msg: error?.message || error || "An error occurred",
        code: 200,
      });
    }
  };

  UpdatePasswordbyForgotPass = async (req, res, next) => {
    try {
      let data = req.body;

      let token = req.params.token;

      let user = await authSrv.verifyToken(token);

      let password = bcrypt.hashSync(data.password, 10);
      let response = await authSrv.UpdatePassword(user._id, password);

      // Update passwordChangedAt when password is reset via forgot password
      await authModal.findByIdAndUpdate(user._id, {
        passwordChangedAt: new Date(),
      });

      console.log("response", response);

      if (response) {
        res.json({
          data: "",
          msg: "Password Updated successfully",
          code: 200,
          meta: null,
        });
      }
    } catch (error) {
      next({
        msg: error,
        code: 200,
      });
    }
  };

  getPasswordStatus = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ msg: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWTSECRETE);
      const userId = decoded.userDetails._id;

      const user = await authSrv.findUserById(userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      const passwordDate =
        user.passwordChangedAt || user.passwordCreatedAt || user.createdAt;
      const daysSinceLastChange = Math.floor(
        (Date.now() - new Date(passwordDate)) / (1000 * 60 * 60 * 24)
      );
      const passwordChangeRequired = daysSinceLastChange >= 180;

      res.json({
        passwordChangeRequired,
        daysSinceLastChange,
        lastPasswordChange: passwordDate,
      });
    } catch (error) {
      next({
        msg: error.message || "Error fetching password status",
        code: 500,
      });
    }
  };

  changePassword = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ msg: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWTSECRETE);
      const userId = decoded.userDetails._id;
      const { currentPassword, newPassword } = req.body;

      const user = await authSrv.findUserById(userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Verify current password
      const isCurrentPasswordValid = bcrypt.compareSync(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ msg: "Current password is incorrect" });
      }

      // Hash new password
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

      // Update password and passwordChangedAt
      await authModal.findByIdAndUpdate(userId, {
        password: hashedNewPassword,
        passwordChangedAt: new Date(),
      });

      res.json({
        msg: "Password changed successfully",
        data: { passwordChangedAt: new Date() },
      });
    } catch (error) {
      next({
        msg: error.message || "Error changing password",
        code: 500,
      });
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      let id = req.params.id;
      let data = req.body;
      await authSrv.resetPassword(data);
      let userDetails = await authSrv.findUserById(id);
      if (!userDetails) {
        next({
          msg: "User not found",
        });
      }

      let currentpass = userDetails.password;

      let matchPass = await bcrypt.compare(data.currentPassword, currentpass);

      if (!matchPass) {
        next({
          msg: "Current password doesnot match",
        });
      } else {
        let newPass = await bcrypt.hashSync(data.newPassword, 10);

        let response = await authModal.findByIdAndUpdate(id, {
          password: newPass,
          passwordChangedAt: new Date(),
        });
        console.log(response);

        res.json({
          msg: "password update successfully",
        });
      }
    } catch (error) {
      console.log(error);

      next({
        msg: error,
      });
    }
  };
}

const authCtrl = new AuthController();
module.exports = authCtrl;
