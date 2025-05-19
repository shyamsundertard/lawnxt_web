import React, { ChangeEvent } from "react";

interface TextAreaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isInvalid?: boolean;
  errorMessage?: string;
  variant?: "outlined" | "contained";
  name?: string;
  label?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  isInvalid = false,
  errorMessage,
  variant = "outlined",
  name,
}) => {
  return (
    <div className="w-full relative">
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
      <textarea
        name={name}
        placeholder={placeholder}
        rows={4}
        defaultValue={value}
        onChange={onChange}
        className={`w-full p-2 rounded-md resize-none focus:ring-1 focus:outline-none text-black 
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

      {isInvalid && errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default TextArea;
