// component/Input.tsx
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import type { UseFormRegister } from "react-hook-form";

interface CustomInputProps {
  name: string;
  validationRules?: Record<string, unknown>;
  type?: "text" | "password" | "email";
  placeholder?: string;
  register: UseFormRegister<any>;
  errors?: any;
}

const CustomInput = ({
  name,
  type = "text",
  placeholder,
  register,
  errors,
  validationRules,
}: CustomInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-4">
      <div className="flex items-center border border-gray-300 rounded p-2 bg-white">
        <input
          type={inputType}
          placeholder={placeholder}
          {...register(name, validationRules)}
          className="w-full focus:outline-none"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="ml-2 text-gray-600"
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        )}
      </div>
      {errors?.[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default CustomInput;
