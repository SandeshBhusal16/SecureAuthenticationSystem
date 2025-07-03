import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const RegisterSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.registered) {
      navigate("/register");
    }
  }, [location, navigate]);

  return (
    <div
      className="h-screen w-full flex justify-center items-center"
      style={{
        background:
          "linear-gradient(90deg, rgba(42, 123, 155, 1) 17%, rgba(69, 168, 142, 1) 42%, rgba(87, 199, 133, 1) 59%, rgba(237, 221, 83, 1) 91%)",
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-2xl w-[400px] text-center">
        <h2 className="text-2xl font-bold text-[#2A7B9B] mb-4">
          Registration Successful!
        </h2>
        <p className="text-gray-700 mb-6">
          Please check your email to verify your account.
        </p>
        <a
          href="https://mail.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#2A7B9B] hover:bg-[#226d87] text-white font-medium px-6 py-2 rounded transition duration-200"
        >
          Go to Your Email
        </a>
      </div>
    </div>
  );
};

export default RegisterSuccess;
