import React from "react";

interface IFormErrorPros {
  errorMessage: string;
}

export const FromError: React.FC<IFormErrorPros> = ({ errorMessage }) => {
  return <span className="text-medium text-red-500">{errorMessage}</span>;
};
