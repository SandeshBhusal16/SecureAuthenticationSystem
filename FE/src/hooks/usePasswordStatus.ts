import { useState, useEffect } from "react";

export interface PasswordStatus {
  passwordChangeRequired: boolean;
  daysSinceLastChange: number;
  lastPasswordChange: string;
}

export const usePasswordStatus = () => {
  const [passwordStatus, setPasswordStatus] = useState<PasswordStatus | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPasswordStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        "http://localhost:3005/v1/auth/password-status",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch password status");
      }

      const data = await response.json();
      setPasswordStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkPasswordStatus();
    }
  }, []);

  return {
    passwordStatus,
    isLoading,
    error,
    refetch: checkPasswordStatus,
  };
};
