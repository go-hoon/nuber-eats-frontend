import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { RESTAURANTS_FRAGMENT } from "../../fragments";
import { restaurant, restaurantVariables } from "../../__generated/restaurant";

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANTS_FRAGMENT}
`;

export const Restaurant = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, data } = useQuery<restaurant, restaurantVariables>(
    RESTAURANT_QUERY,
    {
      variables: { input: { restaurantId: +id } },
    }
  );

  console.log(data);
  return <h1>Restaurant</h1>;
};
