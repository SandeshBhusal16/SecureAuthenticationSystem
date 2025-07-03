import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Verifymail = () => {
  interface FormData {
    email: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (data: FormData) => {
    setPending(true);

    try {
      const response = await axios.post(
        "http://localhost:3005/v1/auth/forgotpassemailsend",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const isSuccess =
        response.data.msg === "Password reset email sent successfully."
          ? true
          : false;
      const toastFn = isSuccess ? toast.success : toast.error;
      toastFn(response?.data?.msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      if (isSuccess) {
        navigate("/verifyMail-success", { state: { verified: true } });
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-2xl w-[400px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2A7B9B] mb-2 text-center">
              Forgot Password?
            </h1>
            <p className="text-sm text-gray-600 text-center mb-4">
              Enter your email address below to receive a verification link.
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              className={`w-full p-2 border rounded focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              type="text"
              {...register("email", {
                required: "Email is required",
                validate: {
                  validEmail: (value) =>
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
                    "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#2A7B9B] hover:bg-[#226d87] text-white font-semibold py-2 rounded transition duration-200"
          >
            {pending ? "Sending....." : "Send Verification Email"}
          </button>
        </form>
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

export default Verifymail;
