import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { CATEGORY_FRAGMENT, RESTAURANTS_FRAGMENT } from "../../fragments";
import { category, categoryVariables } from "../../__generated/category";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANTS_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  const { slug } = useParams<ICategoryParams>();
  const { data, loading } = useQuery<category, categoryVariables>(
    CATEGORY_QUERY,
    { variables: { input: { page: 1, slug } } }
  );
  console.log(data);
  return <h1>Category</h1>;
};
