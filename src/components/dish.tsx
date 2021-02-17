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
      onClick={onClick}
      className={`cursor-pointer px-8 py-4 border hover:border-gray-800 transition-all ${
        isSelected ? "border-gray-800" : "hover:border-gray-800"
      }`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium">{name}</h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer && options && (
        <div>
          <h5 className="mt-8 font-medium">Options</h5>
          {options?.map((option, index) => (
            <span key={index} className="flex items-center">
              <h6 className="mr-2">{option.name}</h6>
              <h6 className="text-sm opacity-75">(+${option.extra})</h6>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
