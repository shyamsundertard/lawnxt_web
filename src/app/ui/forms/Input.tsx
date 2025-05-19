import React, { ChangeEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps {
  placeholder?: string;
  onChange?:
    | ((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void)
    | undefined;
  value: string | number;
  isInvalid?: boolean;
  errorMessage?: string;
  type?: string;
  variant?: "outlined" | "contained";
  name?: string;
  multiple?: boolean;
  label?: string;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  name,
  onChange,
  isInvalid = false,
  errorMessage,
  type = "text",
  variant = "outlined",
  multiple,
  label,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const handleTogglePassword = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div className="w-full relative">
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium mb-1 ${
            isInvalid ? "text-red-500" : "text-gray-700"
          }`}
        >
          {label}
        </label>
      )}

      {/* Input */}
      <input
        id={name}
        name={name}
        multiple={multiple}
        placeholder={placeholder}
        type={type === "password" && isPasswordVisible ? "text" : type}
        value={value} // Ensure proper typecasting
        onChange={onChange}
        className={`w-full p-2 rounded-md bg-white focus:ring-1 focus:outline-none text-black 
          ${
            variant === "outlined"
              ? `${
                  isInvalid
                    ? "border-red-500 focus:ring-red-500 border"
                    : "border-gray-300 focus:ring-gray-500 border"
                }`
              : `${
                  isInvalid
                    ? "bg-red-100 focus:ring-red-500 border border-red-500"
                    : "bg-gray-100 focus:ring-gray-500 border border-gray-300"
                }`
          }`}
      />

      {/* Password Toggle */}
      {type === "password" && (
        <button
          type="button"
          onClick={handleTogglePassword}
          className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-black focus:outline-none"
        >
          {isPasswordVisible ? (
            <FaEyeSlash className="w-5 h-5" />
          ) : (
            <FaEye className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Error Message */}
      {isInvalid && errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;