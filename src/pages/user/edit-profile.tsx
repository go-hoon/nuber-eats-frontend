import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { useMe } from "../../hooks/useMe";
import {
  editProfile,
  editProfileVariables,
} from "../../__generated/editProfile";

const EDIT_PROFIL_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IForm {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        // update cache
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            verified: false,
            email: newEmail,
          },
        });
      }
    }
  };
  const { register, handleSubmit, getValues, formState } = useForm<IForm>({
    mode: "onChange",
    defaultValues: { email: userData?.me.email },
  });

  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: { input: { email, ...(password !== "" && { password }) } },
    });
  };

  const [editProfile, { loading, data }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFIL_MUTATION, { onCompleted });

  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <Helmet>
        <title>Edit Profile | Nuber Eats</title>
      </Helmet>
      <h4 className="font-medium text-xl tracking-wide">Edit Profile</h4>
      <form
        className="grid gap-3 mt-5 max-w-screen-sm w-full mb-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          ref={register({
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          name="email"
          className="input"
          type="email"
          placeholder="Email"
        />
        <input
          ref={register}
          name="password"
          className="input"
          type="password"
          placeholder="Password"
        />
        <Button
          actionText="Update Profile"
          loading={loading}
          canClick={formState.isValid}
        />
      </form>
    </div>
  );
};
