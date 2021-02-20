import { gql, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import {
  DISH_FRAGMENT,
  FULL_ORDER_FRAGMENT,
  ORDERS_FRAGMENT,
  RESTAURANTS_FRAGMENT,
} from "../../fragments";
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../__generated/myRestaurant";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import { pendingOrders } from "../../__generated/pendingOrders";

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
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANTS_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const MyResatuarnt = () => {
  const history = useHistory();
  const { id } = useParams<IParams>();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    { variables: { input: { id: +id } } }
  );

  const { data: subscriptionData } = useSubscription<pendingOrders>(
    PENDING_ORDERS_SUBSCRIPTION
  );

  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      history.push(`/orders/${subscriptionData.pendingOrders.id}`);
    }
  }, [subscriptionData]);

  const triggerPaddle = () => {};

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
        <span
          onClick={triggerPaddle}
          className="text-white bg-lime-700 py-3 px-10"
        >
          Buy Promotion &rarr;
        </span>
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
          <div className="mt-10">
            <VictoryChart
              width={window.innerWidth}
              height={500}
              domainPadding={50}
              containerComponent={<VictoryVoronoiContainer />}
              theme={VictoryTheme.material}
            >
              <VictoryLine
                labels={({ datum }) => `$${datum.y}`}
                labelComponent={
                  <VictoryTooltip
                    renderInPortal
                    style={{ fontSize: 18 }}
                    dy={-25}
                  />
                }
                data={data?.myRestaurant.restaurant.orders?.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation="natural"
                style={{ data: { strokeWidth: 5 } }}
              />
              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal />}
                style={{ tickLabels: { fontSize: 16, angle: 45 } }}
                tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
              />
              <VictoryAxis
                style={{ tickLabels: { fontSize: 16, fill: "#4D7C0F" } }}
                dependentAxis
                tickFormat={(tick) => `$${tick}`}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};
