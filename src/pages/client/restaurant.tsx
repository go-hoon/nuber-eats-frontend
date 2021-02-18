import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DishOption } from "../../components/dish-option";
import { DISH_FRAGMENT, RESTAURANTS_FRAGMENT } from "../../fragments";
import {
  createOrder,
  createOrderVariables,
} from "../../__generated/createOrder";
import {
  CreateOrderInput,
  CreateOrderItemInput,
} from "../../__generated/globalTypes";
import {
  restaurant,
  restaurantVariables,
  restaurant_restaurant_restaurant_menu_options,
} from "../../__generated/restaurant";

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

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`;

export const Restaurant = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { data } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
    variables: { input: { restaurantId: +id } },
  });
  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const triggerStartOrder = () => {
    setOrderStarted(true);
  };
  const addItemToOrder = (dishId: number) => {
    if (orderItems.find((order) => order.dishId === dishId)) {
      return;
    }
    setOrderItems((current) => [...current, { dishId, options: [] }]);
  };
  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };
  const removeFromOrder = (dishId: number) => {
    setOrderItems((current) =>
      current.filter((order) => order.dishId !== dishId)
    );
  };
  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find((aOption) => aOption.name === optionName)
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((current) => [
          { dishId, options: [{ name: optionName }, ...oldItem.options!] },
          ...current,
        ]);
      }
    }
  };
  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string
  ) => {
    return item.options?.find((option) => option.name === optionName);
  };
  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
  };
  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);

    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems((current) => [
        {
          dishId,
          options: oldItem.options?.filter(
            (option) => option.name !== optionName
          ),
        },
        ...current,
      ]);
    }
    return;
  };
  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };
  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { ok, orderId },
    } = data;
    if (data.createOrder.ok) {
      history.push(`/orers/${orderId}`);
      alert("Order created");
    }
  };
  const [createOrderMutation, { loading: placingOrder }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER_MUTATION, { onCompleted });
  const triggerConfirmOrder = () => {
    if (orderItems.length === 0) {
      alert("Can't place an empty order");
      return;
    }
    const ok = window.confirm("You are about to place an order");
    if (ok) {
      createOrderMutation({
        variables: { input: { restaurantId: +id, items: orderItems } },
      });
    }
  };
  console.log(orderItems);

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
      <div className="container flex flex-col items-end">
        {!orderStarted && (
          <button onClick={triggerStartOrder} className="btn px-12 mt-20">
            Start Order
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center">
            <button
              onClick={triggerConfirmOrder}
              className="btn px-12 mt-20 mr-2"
            >
              Confirm Order
            </button>
            <button
              onClick={triggerCancelOrder}
              className="btn px-12 mt-20 bg-black"
            >
              Cancel Order
            </button>
          </div>
        )}

        <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
          {data?.restaurant?.restaurant?.menu?.map((menu, index) => (
            <Dish
              isSelected={isSelected(menu.id)}
              orderStarted={orderStarted}
              key={index}
              description={menu.description}
              name={menu.name}
              price={menu.price}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}
              id={menu.id}
              addOptionToItem={addOptionToItem}
            >
              <div>
                <h5 className="mt-8 font-medium">Options</h5>
                {menu.options?.map((option, index) => (
                  <DishOption
                    key={index}
                    isSelected={isOptionSelected(menu.id, option.name)}
                    name={option.name}
                    extra={option.extra}
                    addOptionToItem={addOptionToItem}
                    removeOptionFromItem={removeOptionFromItem}
                    dishId={menu.id}
                  />
                ))}
              </div>
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};
