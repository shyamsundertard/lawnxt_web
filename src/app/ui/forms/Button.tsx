import React, { ReactNode } from "react";

interface ButtonProps {
    text: string;
    state?: "disabled" | "enabled" | "loading";
    onClick?: () => void;
    type?: "button" | "reset" | "submit";
    variant?: "outlined" | "contained";
    icon?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    text,
    state = "enabled",
    onClick,
    type = "button",
    variant = "contained",
    icon,
}) => {
    const variantStyles = variant === "outlined" 
    ? "bg-transparent border border-black text-black hover:bg-gray-100"
    : "bg-black text-white hover:bg-gray-800";

    return (
        <button
        type={type}
        onClick={onClick}
        disabled={state === "disabled"}
        className={`px-4 h-12 rounded-md ${variantStyles} disabled:bg-gray-500 active:border-black w-full disabled:cursor-not-allowed flex items-center justify-center`}
        >
            {state === "loading" ? (
                <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
            ) : (
                <>
                <span>{text}</span>
                {icon && <span className="ml-2">{icon}</span>}
                </>
            )}
        </button>
    );
};

export default Button;