import { ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import Helmet from "react-helmet";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import nuberLogo from "../images/logo.svg";
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import { UserRole } from "../__generated/globalTypes";
import {
  createAccountMutation,
  createAccountMutationVariables,
} from "../__generated/createAccountMutation";

const CREAT_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const {
    register,
    getValues,
    errors,
    watch,
    handleSubmit,
    formState,
  } = useForm<ICreateAccountForm>({
    mode: "onChange",
    defaultValues: { role: UserRole.Client },
  });

  const onError = (error: ApolloError) => {};

  const [createAccountMutation] = useMutation<
    createAccountMutation,
    createAccountMutationVariables
  >(CREAT_ACCOUNT_MUTATION);

  const onSubmit = () => {
    console.log(watch());
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Create Account | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <img src={nuberLogo} alt="logo" className="w-52 mb-10" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Let's get started{" "}
        </h4>
        <form
          className="grid gap-3 mt-5 w-full mb-5"
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
          <select
            className="input"
            ref={register({ required: true })}
            name="role"
          >
            {Object.keys(UserRole).map((role, i) => (
              <option key={i}>{role}</option>
            ))}
          </select>
          <Button
            canClick={formState.isValid}
            loading={false}
            actionText="Create Account"
          />
        </form>
        <div>
          Already have an account?{" "}
          <Link to="/login" className="text-lime-600 hover:underline">
            Login now
          </Link>
        </div>
      </div>
    </div>
  );
};
