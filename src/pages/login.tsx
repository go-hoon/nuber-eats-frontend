import { ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FromError } from "../components/form-error";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated/loginMutation";

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
  const {
    register,
    getValues,
    errors,
    watch,
    handleSubmit,
  } = useForm<ILoginForm>();

  const onCompleted = (data: loginMutation) => {
    if (data.login.ok) {
      const {
        login: { error, ok, token },
      } = data;
      if (ok) {
        console.log(token);
      }
    }
  };
  const onError = (error: ApolloError) => {};

  const [loginMutation, { data: loginMutationResult }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
    onError,
  });

  const onSubmit = () => {
    const { email, password } = getValues();
    loginMutation({
      variables: {
        loginInput: {
          email,
          password,
        },
      },
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg py-10 rounded-lg text-center">
        <h3 className="text-2xl text-gray-800">Log In</h3>
        <form
          className="grid gap-3 mt-5 px-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            ref={register({ required: "Email is required" })}
            name="email"
            type="email"
            placeholder="Email"
            className="input"
          ></input>
          {errors.email?.message && (
            <FromError errorMessage={errors.email.message} />
          )}
          <input
            ref={register({ required: "Password is required" })}
            name="password"
            type="password"
            placeholder="Password"
            className="input mt-3"
          ></input>
          {errors.password?.message && (
            <FromError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FromError
              errorMessage={"Passwords should be more than 10 chars"}
            />
          )}
          <button className="btn mt-3">Log In</button>
          {loginMutationResult?.login?.error && (
            <FromError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
      </div>
    </div>
  );
};
