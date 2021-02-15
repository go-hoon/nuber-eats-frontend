import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DISH_FRAGMENT, RESTAURANTS_FRAGMENT } from "../../fragments";
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../__generated/myRestaurant";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryPie } from "victory";

const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
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

interface IParams {
  id: string;
}

const chartData = [
  { x: 1, y: 3000 },
  { x: 2, y: 1500 },
  { x: 3, y: 3000 },
  { x: 4, y: 4250 },
  { x: 5, y: 2300 },
  { x: 6, y: 7150 },
  { x: 7, y: 6830 },
  { x: 8, y: 2300 },
  { x: 9, y: 5150 },
  { x: 10, y: 3830 },
];

export const MyResatuarnt = () => {
  const { id } = useParams<IParams>();
  const { data, error, loading } = useQuery<
    myRestaurant,
    myRestaurantVariables
  >(MY_RESTAURANT_QUERY, { variables: { input: { id: +id } } });
  console.log(data);
  return (
    <div>
      <div
        className="bg-gray-700 py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant.coverImg})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant.name || "Loading..."}
        </h2>
        <Link
          to={`/restaurant/${data?.myRestaurant.restaurant.id}/add-dish`}
          className="mr-8 text-white bg-gray-800 py-3 px-10"
        >
          Add Dish &rarr;
        </Link>
        <Link to={``} className="text-white bg-lime-700 py-3 px-10">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu?.length === 0 ? (
            <h4 className="text-xl mb-5">Please upload a dish</h4>
          ) : (
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.myRestaurant.restaurant.menu?.map((menu) => (
                <Dish
                  description={menu.description}
                  name={menu.name}
                  price={menu.price}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-20">
          <h4 className="text-center text-2xl font-medium">Sales</h4>
          <div className="max-w-md w-full mx-auto">
            <VictoryPie data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};
