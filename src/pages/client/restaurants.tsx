import { gql, useQuery } from "@apollo/client";
import React from "react";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated/restaurantsPageQuery";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

export const Restaurants = () => {
  const { data, loading, error } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, { variables: { input: { page: 1 } } });

  return (
    <div>
      <form className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <input
          type="Search"
          placeholder="Search Restaurants..."
          className="input w-5/12 rounded-md border-0"
        />
      </form>
      {!loading && (
        <div className="max-w-screen-xl mx-auto mt-8">
          <div className="flex justify-center mx-auto overflow-x-auto">
            {data?.allCategories.categories?.map((category) => (
              <div className="mx-4 lg:mx-8">
                <div
                  className="w-14 h-14 rounded-full bg-cover hover:bg-gray-200 cursor-pointer"
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                ></div>
                <span className="mt-1 text-sm flex flex-col items-center font-medium">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
