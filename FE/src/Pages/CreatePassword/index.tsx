import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

type FormData = {
  password: string;
  confirmPassword: string;
};

const CreatePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const password = watch("password");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);
    try {
      const response = await axios.post(
        `http://localhost:3005/v1/auth/createpassword/${token}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response)
        navigate("/createpassword-success", {
          state: { passwordCreated: true },
        });
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  // Password quality checks
  const hasUpperCase = /[A-Z]/.test(password || "");
  const hasLowerCase = /[a-z]/.test(password || "");
  const hasNumber = /\d/.test(password || "");
  const hasSymbol = /[^A-Za-z0-9]/.test(password || "");
  const isLongEnough = (password || "").length >= 8;

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-2xl w-[400px]">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#2A7B9B]">
          Create Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Password Field */}
          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div
              className={`flex items-center p-2 border rounded ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            >
              <input
                className="w-full focus:outline-none"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  validate: {
                    hasUpperCase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Must contain at least one uppercase letter",
                    hasLowerCase: (value) =>
                      /[a-z]/.test(value) ||
                      "Must contain at least one lowercase letter",
                    hasNumber: (value) =>
                      /\d/.test(value) || "Must contain at least one number",
                    hasSymbol: (value) =>
                      /[^A-Za-z0-9]/.test(value) ||
                      "Must contain at least one special character",
                    isLongEnough: (value) =>
                      value.length >= 8 || "Must be at least 8 characters long",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 text-gray-600"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>

          {/* Criteria Checklist */}
          <div className="text-sm text-gray-600 space-y-1 mb-3">
            <p className={hasUpperCase ? "text-green-600" : "text-red-500"}>
              • At least one uppercase letter
            </p>
            <p className={hasLowerCase ? "text-green-600" : "text-red-500"}>
              • At least one lowercase letter
            </p>
            <p className={hasNumber ? "text-green-600" : "text-red-500"}>
              • At least one number
            </p>
            <p className={hasSymbol ? "text-green-600" : "text-red-500"}>
              • At least one special character
            </p>
            <p className={isLongEnough ? "text-green-600" : "text-red-500"}>
              • Minimum 8 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div
              className={`flex items-center p-2 border rounded ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            >
              <input
                className="w-full focus:outline-none"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="ml-2 text-gray-600"
              >
                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#2A7B9B] hover:bg-[#226d87] text-white font-semibold py-2 rounded transition duration-200"
          >
            Create Password
          </button>
        </form>

        {/* Navigation */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-[#2A7B9B] font-medium hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default CreatePassword;
