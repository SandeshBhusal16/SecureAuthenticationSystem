import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordProps {
  onPasswordChanged?: () => void;
}

const ChangePassAfter180Days: React.FC<ChangePasswordProps> = ({
  onPasswordChanged,
}) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const newPassword = watch("newPassword");
  const currentPassword = watch("currentPassword");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const hasUpperCase = /[A-Z]/.test(newPassword || "");
  const hasLowerCase = /[a-z]/.test(newPassword || "");
  const hasNumber = /\d/.test(newPassword || "");
  const hasSymbol = /[^A-Za-z0-9]/.test(newPassword || "");
  const isLongEnough = (newPassword || "").length >= 8;

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3005/v1/auth/changepassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Password changed successfully!");
        if (onPasswordChanged) {
          onPasswordChanged();
        } else {
          navigate("/home");
        }
      } else {
        setErrorMessage(result.msg || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <div
            className={`w-full flex p-2 border rounded focus:outline-none ${
              errors.currentPassword ? "border-red-500" : "border-gray-300"
            }`}
          >
            <input
              className="w-full focus:outline-none"
              type={showCurrentPassword ? "text" : "password"}
              {...register("currentPassword", {
                required: "Current password is required",
              })}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="ml-2 text-gray-600"
            >
              {showCurrentPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div
            className={`flex items-center p-2 border rounded ${
              errors.newPassword ? "border-red-500" : "border-gray-300"
            }`}
          >
            <input
              className="w-full focus:outline-none"
              type={showNewPassword ? "text" : "password"}
              {...register("newPassword", {
                required: "New password is required",
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
                  notSameAsCurrent: (value) =>
                    value !== currentPassword ||
                    "New password must be different from current password",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="ml-2 text-gray-600"
            >
              {showNewPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message as string}
            </p>
          )}

          <div className="text-sm text-gray-600 space-y-1 mt-2">
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
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div
            className={`flex items-center p-2 border rounded ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          >
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              className={`w-full focus:outline-none `}
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#2A7B9B] text-white font-semibold py-2 rounded hover:bg-[#226d87] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating Password..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassAfter180Days;
