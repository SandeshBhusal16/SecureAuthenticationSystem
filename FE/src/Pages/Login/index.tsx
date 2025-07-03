import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";

const LoginPage = () => {
  type LoginFormInputs = {
    email: string;
    password: string;
  };

  const [isLocked, setIsLocked] = useState(() => {
    const storedLock = localStorage.getItem("lockUntil");
    return storedLock && Date.now() < Number(storedLock);
  });

  const [lockSeconds, setLockSeconds] = useState(() => {
    const lockUntil = localStorage.getItem("lockUntil");
    const remaining = lockUntil
      ? Math.ceil((Number(lockUntil) - Date.now()) / 1000)
      : 0;
    return remaining > 0 ? remaining : 0;
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  // Countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && lockSeconds > 0) {
      timer = setInterval(() => {
        setLockSeconds((prev) => {
          const updated = prev - 1;
          if (updated <= 0) {
            clearInterval(timer);
            setIsLocked(false);
            setLockSeconds(0);
            localStorage.removeItem("lockUntil");
          }
          return updated;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockSeconds]);

  const onSubmit = async (data: LoginFormInputs) => {
    if (isLocked) return;

    try {
      const response = await axios.post(
        "http://localhost:3005/v1/auth/login",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const serverMsg = response?.data?.msg;

      // Detect lockout from backend response
      if (
        serverMsg &&
        typeof serverMsg === "string" &&
        serverMsg.includes("Too many failed attempts")
      ) {
        const match = serverMsg.match(/in (\d+) seconds/i);
        const seconds = match ? parseInt(match[1]) : 60;

        const lockUntil = Date.now() + seconds * 1000;
        localStorage.setItem("lockUntil", lockUntil.toString());

        setIsLocked(true);
        setLockSeconds(seconds);

        toast.error(serverMsg, {
          position: "top-right",
          autoClose: 5000,
          transition: Bounce,
        });
        return;
      }

      const isSuccess = serverMsg === "User logged in successfully";
      const toastFn = isSuccess ? toast.success : toast.error;

      toastFn(serverMsg, {
        position: "top-right",
        autoClose: 5000,
        transition: Bounce,
      });

      if (isSuccess) {
        // Handle both possible response structures
        const tokenData = response.data.result || response.data.data;
        localStorage.setItem("token", tokenData.accessToken);

        // Check if password change is required
        if (tokenData.passwordChangeRequired) {
          toast.warning(
            "Your password has expired. Please change it to continue.",
            {
              position: "top-right",
              autoClose: 5000,
              transition: Bounce,
            }
          );
        }

        navigate("/home");
      }
    } catch (error: any) {
      const serverMsg = error?.response?.data?.msg || "Login failed";
      toast.error(serverMsg, {
        position: "top-right",
        autoClose: 5000,
        transition: Bounce,
      });
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-2xl w-[400px]">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#2A7B9B]">
          Login
        </h2>

        {isLocked && (
          <p className="text-red-600 text-center mb-4">
            Too many attempts. Try again in {lockSeconds} seconds.
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              disabled={isLocked}
              className={`w-full p-2 border rounded focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              type="text"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              disabled={isLocked}
              className={`w-full p-2 border rounded focus:outline-none ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
              })}
            />
            <button
              type="button"
              className="absolute right-2 top-10.5 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Forgot your password?{" "}
            <a
              href="/verifyMail"
              className="text-[#2A7B9B] font-medium hover:underline"
            >
              Reset it
            </a>
          </p>

          <button
            type="submit"
            disabled={isLocked}
            className={`w-full ${
              isLocked
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2A7B9B] hover:bg-[#226d87]"
            } text-white font-semibold py-2 mt-6 rounded transition duration-200`}
          >
            {isLocked ? `Try again in ${lockSeconds}s` : "Login"}
          </button>
        </form>

        <hr className="mt-6 border-gray-300" />

        <div className="mt-4 w-full flex">
          <a
            href="/register"
            className="text-[#2A7B9B] text-center text-sm w-full p-3 border border-[#2A7B9B] rounded hover:bg-[#2A7B9B] hover:text-white transition"
          >
            Register
          </a>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default LoginPage;
