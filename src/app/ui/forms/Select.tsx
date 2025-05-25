import React from "react";

interface SelectProps {
  options: { value: string; label: string }[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  name?: string;
  label?: string;
  value?: string;
  disabled?: boolean
}

const Select: React.FC<SelectProps> = ({
  options,
  onChange,
  placeholder = "Select an option",
  isInvalid = false,
  errorMessage,
  name,
  label,
  value,
  disabled = false,
}) => {
  return (
    <div className="w-full">
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
      <select
        onChange={onChange}
        value={value}
        disabled={disabled}
        className={`w-full p-[9px] border rounded-md 
          ${disabled 
            ? "bg-gray-300" 
            : "bg-white"
          } 
          focus:border-black focus:outline-none text-black 
          ${
            isInvalid
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-gray-500"
          } cursor-pointer`}
      >
        {!value && (
          <option value="" className="bg-gray-200">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            className="bg-white text-black focus:bg-white cursor-pointer"
            style={{
              appearance: "none",
            }}
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      {isInvalid && errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default Select;
