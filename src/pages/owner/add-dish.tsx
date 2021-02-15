import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { createDish, createDishVariables } from "../../__generated/createDish";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

export const AddDish = () => {
  const { resturantId } = useParams<{ resturantId: string }>();
  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION);

  return <h2>AddDish</h2>;
};
