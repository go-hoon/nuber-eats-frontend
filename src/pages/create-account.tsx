import { ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import nuberLogo from "../images/logo.svg";
import { Button } from "../components/button";
import { Link, useHistory } from "react-router-dom";
import { UserRole } from "../__generated/globalTypes";
import {
  createAccountMutation,
  createAccountMutationVariables,
} from "../__generated/createAccountMutation";
import { isLoggedInVar } from "../apollo";

export const CREAT_ACCOUNT_MUTATION = gql`
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

  const history = useHistory();
  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      alert("Account is created! Login now!");
      history.push("/");
    }
  };

  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREAT_ACCOUNT_MUTATION,
    { onCompleted }
  );

  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
          },
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Create Account | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <img src={nuberLogo} alt="logo" className="w-52 mb-10" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Let's get started
        </h4>
        <form
          className="grid gap-3 mt-5 w-full mb-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            ref={register({
              required: "Email is required",
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            type="email"
            placeholder="Email"
            className="input transition-colors"
          ></input>
          {errors.email?.message ? (
            <FormError errorMessage={errors.email.message} />
          ) : null}
          {errors.email?.type === "pattern" ? (
            <FormError errorMessage={"Please enter a valid email"} />
          ) : null}
          <input
            ref={register({ required: "Password is required" })}
            name="password"
            type="password"
            placeholder="Password"
            className="input"
          ></input>
          {errors.password?.message ? (
            <FormError errorMessage={errors.password?.message} />
          ) : null}
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
          {createAccountMutationResult?.createAccount.error ? (
            <FormError
              errorMessage={createAccountMutationResult?.createAccount.error}
            />
          ) : null}
        </form>
        <div>
          Already have an account?{" "}
          <Link to="/" className="text-lime-600 hover:underline">
            Login now
          </Link>
        </div>
      </div>
    </div>
  );
};
