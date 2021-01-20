import { gql, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import {
  verifyEmail,
  verifyEmailVariables,
} from "../../__generated/verifyEmail";

export const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const [verifyEmail, { loading: verifyingEmail }] = useMutation<
    verifyEmail,
    verifyEmailVariables
  >(VERIFY_EMAIL_MUTATION);

  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    verifyEmail({
      variables: { input: { code } },
    });
    console.log(code);
  }, []);
  return (
    <div className="mt-20 h-screen flex flex-col items-center justify-center">
      <h2 className="text-lg mb-1 font-medium">Confirming Email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, don't cloes this page
      </h4>
    </div>
  );
};
