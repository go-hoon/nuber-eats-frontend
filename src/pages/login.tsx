import React from "react";

export const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg py-10 rounded-lg text-center">
        <h3 className="text-3lg text-gray-800">Log In</h3>
        <form className="flex flex-col mt-5 px-5">
          <input
            placeholder="Email"
            className="bg-gray-100 shadow-inner mb-3 py-3 px-5 rounded-lg focus:outline-none border-2 focus:border-opacity-50 focus:border-green-500"
          ></input>
          <input
            placeholder="Password"
            className="bg-gray-100 shadow-inner py-3 px-5 rounded-lg focus:outline-none border-2 focus:border-opacity-50 focus:border-green-500"
          ></input>
          <button className="py-3 px-5 bg-gray-800 text-white font-medium rounded-lg text-lg mt-3 focus:outline-none hover:opacity-90">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};
