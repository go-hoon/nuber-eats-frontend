import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../__generated/createRestaurant";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
}

export const AddRestaurant = () => {
  const [createRestaurantMutaion, { data, loading }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION);
  const {
    register,
    getValues,
    formState,
    errors,
    handleSubmit,
  } = useForm<IFormProps>({ mode: "onChange" });

  const onSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <div className="container">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h1>Add Restaurant</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Name"
          ref={register({ required: "Name is required" })}
        ></input>
        <input
          className="input"
          type="text"
          name="address"
          placeholder="Address"
          ref={register({ required: "Address is required" })}
        ></input>
        <input
          className="input"
          type="text"
          name="categoryName"
          placeholder="Category Name"
          ref={register({ required: "Category name is required" })}
        ></input>
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Create Restaurant"
        />
      </form>
    </div>
  );
};
