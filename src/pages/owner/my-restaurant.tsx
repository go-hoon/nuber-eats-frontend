import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { RESTAURANTS_FRAGMENT } from "../../fragments";
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../__generated/myRestaurant";

const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANTS_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const MyResatuarnt = () => {
  const { id } = useParams<IParams>();
  const { data, error, loading } = useQuery<
    myRestaurant,
    myRestaurantVariables
  >(MY_RESTAURANT_QUERY, { variables: { input: { id: +id } } });
  console.log(data);
  return <h1>MyRestaurant</h1>;
};
