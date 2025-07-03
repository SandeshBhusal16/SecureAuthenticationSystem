import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../Pages/Login";
import RegisterPage from "../Pages/Register";
import CreatePassword from "../Pages/CreatePassword";
import Verifymail from "../Pages/VarifyMail";
import UpdatePassword from "../Pages/UpdatePassword";
import ChangePassAfter180Days from "../Pages/ChangePassword";
import HomePage from "../Pages/homepage.tsx";
import ProtectedRoute from "./protectedRoute";
import PasswordCheckWrapper from "../component/PasswordCheckWrapper";
import RegisterSuccess from "../Pages/Register/successPage.tsx";
import VerifyMailSuccess from "../Pages/VarifyMail/successPage.tsx";
import CreatePasswordSuccess from "../Pages/CreatePassword/successPage.tsx";
import UpdatePasswordSuccess from "../Pages/UpdatePassword/successPage.tsx";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <PasswordCheckWrapper>
                <HomePage />
              </PasswordCheckWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-success" element={<RegisterSuccess />} />
        <Route path="/createpassword/:token" element={<CreatePassword />} />
        <Route
          path="/createpassword-success"
          element={<CreatePasswordSuccess />}
        />

        <Route path="/verifyMail" element={<Verifymail />} />
        <Route path="/verifyMail-success" element={<VerifyMailSuccess />} />
        <Route
          path="/update-password-success"
          element={<UpdatePasswordSuccess />}
        />

        <Route path="updatepass/:token" element={<UpdatePassword />} />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Change Password
                  </h2>
                  <ChangePassAfter180Days />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
