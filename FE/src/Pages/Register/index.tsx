import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

const RegisterPage = () => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleCaptchaChange = (token: string | null) => {
    setIsCaptchaVerified(!!token);
  };

  type RegisterFormData = {
    name: string;
    email: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormData) => {
    if (isCaptchaVerified) {
      try {
        const response = await axios.post(
          "http://localhost:3005/v1/auth/register",
          data
        );
        const success = response.data.msg === "User Registered successfully.";

        recaptchaRef.current?.reset();
        if (success) {
          navigate("/register-success", { state: { registered: true } });
        } else {
          toast.error(response.data.msg);
          console.log(response.data.msg);
        }
      } catch (error: any) {
        console.error("Error during form submission:", error);
        const errorMessage =
          error.response?.data?.msg || "Registration failed. Please try again.";
        toast.error(errorMessage);
      }
    } else {
      console.log("Please verify the CAPTCHA before submitting.");
    }
  };

  return (
    <div
      className="h-screen w-full flex justify-center items-center"
      style={{
        background:
          "linear-gradient(90deg, rgba(42, 123, 155, 1) 17%, rgba(69, 168, 142, 1) 42%, rgba(87, 199, 133, 1) 59%, rgba(237, 221, 83, 1) 91%)",
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-2xl w-[400px]">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#2A7B9B]">
          Register
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              className={`w-full p-2 border rounded focus:outline-none ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              type="text"
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message as string}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              className={`w-full p-2 border rounded focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              type="email"
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
                {errors.email.message as string}
              </p>
            )}
          </div>

          {/* reCAPTCHA */}
          <div className="flex flex-col items-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LeDN2QrAAAAAEO6_ezxQDllsCOms7vsmKlbggO2"
              onChange={handleCaptchaChange}
            />
            {!isCaptchaVerified && (
              <p className="text-red-500 text-sm mt-2">
                Please complete the CAPTCHA.
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#2A7B9B] hover:bg-[#226d87] text-white font-semibold py-2 rounded transition duration-200"
          >
            Register
          </button>
        </form>

        {/* Already Registered */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/" className="text-[#2A7B9B] hover:underline font-medium">
            Login
          </a>
        </p>
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

export default RegisterPage;
