import React from "react";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({
  actionText,
  loading,
  canClick,
}) => {
  return (
    <button
      className={`${
        canClick
          ? "bg-lime-500 hover:bg-lime-600"
          : "bg-gray-300 pointer-events-none"
      } mt-3 py-4 focus:outline-none text-lg font-medium text-white  transition-colors`}
    >
      {loading ? "Loading..." : actionText}
    </button>
  );
};
