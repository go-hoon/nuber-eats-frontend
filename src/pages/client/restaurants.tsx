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
        <div className="max-w-screen-xl mx-auto mt-8 px-5 xl:px-0">
          <div className="flex justify-center mx-auto overflow-x-auto">
            {data?.allCategories.categories?.map((category) => (
              <div className="flex flex-col items-center mx-4 lg:mx-8 group">
                <div
                  className="w-14 h-14 rounded-full bg-cover group-hover:bg-gray-200 cursor-pointer"
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                ></div>
                <span className="mt-1 text-sm flex flex-col items-center font-medium cursor-pointer">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
          <div className="grid mt-10 grid-cols-3 gap-x-5 gap-y-10">
            {data?.restaurants.results?.map((restaurant) => (
              <div>
                <div
                  className="bg-red-500 py-28 bg-cover bg-center mb-3"
                  style={{ backgroundImage: `url(${restaurant.coverImg})` }}
                ></div>
                <h3 className="text-md font-semibold">{restaurant.name}</h3>
                <span className="border-t-2 border-gray-200">
                  {restaurant.category?.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
