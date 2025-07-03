import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { use, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface JwtPayload {
  userDetails?: {
    _id: string;
  };
}

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const newPassword = watch("newPassword");
  const currentPassword = watch("currentPassword");

  const logout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout Successfully", {
      position: "top-right",
      autoClose: 5000,
      theme: "light",
      transition: Bounce,
    });
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const onSubmit = async (data: FormData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User token not found.");
      return;
    }

    const decoded = jwtDecode<JwtPayload>(token);
    const userId = decoded?.userDetails?._id;

    if (!userId) {
      toast.error("User not identified.");
      return;
    }
    console.log(userId);

    try {
      const response = await axios.post(
        `http://localhost:3005/v1/auth/resetPassword/${userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password changed successfully");
      } else {
        toast.error("Failed to change password");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.msg ||
          "Something went wrong during password change."
      );
      console.error("Password reset error:", error);
    }
  };

  const hasUpperCase = /[A-Z]/.test(newPassword || "");
  const hasLowerCase = /[a-z]/.test(newPassword || "");
  const hasNumber = /\d/.test(newPassword || "");
  const hasSymbol = /[^A-Za-z0-9]/.test(newPassword || "");
  const isLongEnough = (newPassword || "").length >= 8;

  return (
    <div className="h-screen w-full flex">
      {/* Sidebar */}
      <div className="w-[250px] bg-[#2A7B9B] text-white flex flex-col items-center py-10">
        <h2 className="text-xl font-bold mb-10">Ecom Panel</h2>

        <a
          href="#change-password"
          className="mb-4 w-full text-center py-3 bg-[#226d87] transition"
        >
          Change Password
        </a>

        <button
          onClick={logout}
          className="mt-auto mb-6 text-white cursor-pointer px-4 py-2 border rounded-md"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-[#2A7B9B] mb-6">
            Change Password
          </h1>

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
                        value.length >= 8 ||
                        "Must be at least 8 characters long",
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
              className="w-full bg-[#2A7B9B] text-white font-semibold py-2 rounded hover:bg-[#226d87] transition duration-200"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-black opacity-[0.5] w-full h-screen absolute "></div>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4 z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout from your account?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-[#2A7B9B] text-white rounded hover:bg-[#226d87] transition duration-200"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default HomePage;
