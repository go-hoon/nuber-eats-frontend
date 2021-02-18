import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { getOrder, getOrderVariables } from "../__generated/getOrder";

const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        id
        status
        total
        driver {
          id
          email
        }
        customer {
          id
          email
        }
        restaurant {
          id
          name
        }
      }
    }
  }
`;

interface IParams {
  id: string;
}

export const Order = () => {
  const { id } = useParams<IParams>();
  const { data, loading, error } = useQuery<getOrder, getOrderVariables>(
    GET_ORDER,
    { variables: { input: { id: +id } } }
  );
  console.log(data);
  return <h2>good</h2>;
};
