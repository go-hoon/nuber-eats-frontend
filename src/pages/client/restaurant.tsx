import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DISH_FRAGMENT, RESTAURANTS_FRAGMENT } from "../../fragments";
import { restaurant, restaurantVariables } from "../../__generated/restaurant";

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANTS_FRAGMENT}
  ${DISH_FRAGMENT}
`;

export const Restaurant = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
    variables: { input: { restaurantId: +id } },
  });
  console.log(data?.restaurant.restaurant?.category);

  return (
    <div>
      <div
        className="bg-gray-800 py-40 bg-cover"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className="bg-white w-3/12 pl-44 pr-6 py-4">
          <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
          <h5 className="text-sm font-light">
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
      <div className="container grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
        {data?.restaurant?.restaurant?.menu?.map((menu, index) => (
          <Dish
            key={index}
            description={menu.description}
            name={menu.name}
            price={menu.price}
            isCustomer={true}
            options={menu.options}
          />
        ))}
      </div>
    </div>
  );
};
