import React, { useState, useEffect } from "react";
import ChangePassAfter180Days from "../Pages/ChangePassword";
import { usePasswordStatus } from "../hooks/usePasswordStatus";

interface PasswordCheckWrapperProps {
  children: React.ReactNode;
}

const PasswordCheckWrapper: React.FC<PasswordCheckWrapperProps> = ({
  children,
}) => {
  const { passwordStatus, isLoading } = usePasswordStatus();
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  useEffect(() => {
    if (passwordStatus?.passwordChangeRequired) {
      setShowPasswordChange(true);
    }
  }, [passwordStatus]);

  const handlePasswordChanged = () => {
    setShowPasswordChange(false);
  };

  // Don't render children if loading or password change is required
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2A7B9B]"></div>
      </div>
    );
  }

  if (showPasswordChange) {
    return (
      <div className="rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Password Change Required
            </h2>
            <p className="text-gray-600">
              Your password has expired after 180 days. Please change your
              password to continue.
            </p>
            {passwordStatus && (
              <p className="text-sm text-gray-500 mt-2">
                Last changed: {passwordStatus.daysSinceLastChange} days ago
              </p>
            )}
          </div>
          <ChangePassAfter180Days onPasswordChanged={handlePasswordChanged} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PasswordCheckWrapper;
