import React from "react";
import { Link } from "react-router-dom";

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  coverImg,
  categoryName,
  name,
  id,
}) => {
  return (
    <Link to={`restaurant/${id}`}>
      <div className="flex flex-col">
        <div
          className="py-28 bg-cover bg-center mb-3"
          style={{ backgroundImage: `url(${coverImg})` }}
        ></div>
        <h3 className="text-md font-semibold">{name}</h3>
        <span className="border-t mt-3 py-2 text-xs opacity-50 border-gray-300">
          {categoryName}
        </span>
      </div>
    </Link>
  );
};
