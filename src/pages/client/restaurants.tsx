import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
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

interface IFormProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, { variables: { input: { page } } });

  const onNextPageClick = () => setPage(page + 1);
  const onPrevPageClick = () => setPage(page - 1);

  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `term=${searchTerm}`,
    });
  };

  return (
    <div>
      <form
        className="bg-gray-800 w-full py-40 flex items-center justify-center"
        onSubmit={handleSubmit(onSearchSubmit)}
      >
        <input
          ref={register({ required: true, minLength: 3 })}
          name="searchTerm"
          type="Search"
          placeholder="Search Restaurants..."
          className="input rounded-md border-0 md:w-4/12 w-3/4"
        />
      </form>
      {!loading && (
        <div className="max-w-screen-xl mx-auto mt-8 px-5 pb-20 xl:px-0">
          <div className="flex justify-center mx-auto overflow-x-auto">
            {data?.allCategories.categories?.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center mx-4 lg:mx-8 group"
              >
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
          <div className="grid mt-12 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-cneter max-w-md items-center mx-auto mt-10">
            {page > 1 ? (
              <button
                className="focus:outline-none font-medium text-2xl cursor-pointer"
                onClick={onPrevPageClick}
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span className="text-center">
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button
                className="focus:outline-none font-medium text-2xl cursor-pointer"
                onClick={onNextPageClick}
              >
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
