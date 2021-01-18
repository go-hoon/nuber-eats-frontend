import { ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated/loginMutation";
import nuberLogo from "../images/logo.svg";

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const { register, getValues, errors, handleSubmit } = useForm<ILoginForm>();

  const onCompleted = (data: loginMutation) => {
    if (data.login.ok) {
      const {
        login: { ok, token },
      } = data;
      if (ok) {
        console.log(token);
      }
    }
  };
  const onError = (error: ApolloError) => {};

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
    onError,
  });

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <img src={nuberLogo} alt="logo" className="w-52 mb-10" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Welcome back
        </h4>
        <form
          className="grid gap-3 mt-5 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            ref={register({ required: "Email is required" })}
            name="email"
            type="email"
            placeholder="Email"
            className="input transition-colors"
          ></input>
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message} />
          )}
          <input
            ref={register({ required: "Password is required" })}
            name="password"
            type="password"
            placeholder="Password"
            className="input mt-3"
          ></input>
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError
              errorMessage={"Passwords should be more than 10 chars"}
            />
          )}
          <button className="mt-3 py-4 text-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">
            {loading ? "Loading..." : "Login"}
          </button>
          {loginMutationResult?.login?.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
      </div>
    </div>
  );
};
