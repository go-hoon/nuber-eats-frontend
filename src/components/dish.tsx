import React from "react";
import { restaurant_restaurant_restaurant_menu_options } from "../__generated/restaurant";

interface IDishProps {
  name: string;
  description: string;
  price: number;
  isSelected?: boolean;
  isCustomer?: boolean;
  options?: restaurant_restaurant_restaurant_menu_options[] | null;
  orderStarted?: boolean;
  addItemToOrder?: (dishId: number) => void;
  id?: number;
  removeFromOrder?: (dishId: number) => void;
  addOptionToItem?: (dishId: number, option: any) => void;
}

export const Dish: React.FC<IDishProps> = ({
  description,
  name,
  price,
  isCustomer = false,
  orderStarted = false,
  options,
  addItemToOrder,
  id = 0,
  isSelected,
  removeFromOrder,
  addOptionToItem,
  children: dishOptions,
}) => {
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        removeFromOrder(id);
      }
    }
  };

  return (
    <div
      className={`cursor-pointer px-8 py-4 border hover:border-gray-800 transition-all ${
        isSelected ? "border-gray-800" : "hover:border-gray-800"
      }`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium">
          {name}
          {orderStarted && (
            <button onClick={onClick}>{isSelected ? "Remove" : "Add"}</button>
          )}
        </h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {dishOptions}
    </div>
  );
};
