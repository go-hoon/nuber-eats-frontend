import React from "react";

interface IFormErrorPros {
  errorMessage: string;
}

export const FormError: React.FC<IFormErrorPros> = ({ errorMessage }) => {
  return (
    <span role="alert" className="text-medium text-red-500">
      {errorMessage}
    </span>
  );
};
