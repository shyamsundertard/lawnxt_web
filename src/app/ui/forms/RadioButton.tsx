import React, { ChangeEvent, FC } from "react";

interface RadioButtonProps {
  label: string;
  name: string;
  value?: string;
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  theme?: "black" | "white";
}

const RadioButton: FC<RadioButtonProps> = ({
  label,
  name,
  value,
  checked,
  onChange,
  theme = "black",
}) => {
  return (
    <label
      className={`flex items-center space-x-2 cursor-pointer ${
        theme === "black" ? "text-black" : "text-white"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked || false}
        onChange={onChange}
        className={`h-5 w-5 rounded-full border-2 cursor-pointer ${
          theme === "black" ? "accent-black" : "accent-white"
        }`}
      />
      <span>{label}</span>
    </label>
  );
};

export default RadioButton;
