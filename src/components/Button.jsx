import React from "react";

function Button({ children, type = "button", className = "", ...props }) {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
