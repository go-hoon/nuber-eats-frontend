import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Header } from "../components/header";

import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Category } from "../pages/client/category";
import { Restaurant } from "../pages/client/restaurant";
import { Restaurants } from "../pages/client/restaurants";
import { Search } from "../pages/client/search";
import { Order } from "../pages/order";
import { AddDish } from "../pages/owner/add-dish";
import { AddRestaurant } from "../pages/owner/add-restaurant";
import { MyResatuarnt } from "../pages/owner/my-restaurant";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";

const clientRoutes = [
  { path: "/", component: <Restaurants /> },
  { path: "/search", component: <Search /> },
  { path: "/category/:slug", component: <Category /> },
  { path: "/restaurant/:id", component: <Restaurant /> },
];

const commonRoutes = [
  { path: "/edit-profile", component: <EditProfile /> },
  { path: "/confirm", component: <ConfirmEmail /> },
  { path: "/orders/:id", component: <Order /> },
];

const ownerRoutes = [
  { path: "/", component: <MyRestaurants /> },
  { path: "/add-restaurant", component: <AddRestaurant /> },
  { path: "/restaurant/:id", component: <MyResatuarnt /> },
  { path: "/restaurant/:restaurantId/add-dish", component: <AddDish /> },
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  console.log(data);
  console.log(loading);
  console.log(error);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <Header email={data.me.email} />
      <Switch>
        {data.me.role === "Client" &&
          clientRoutes.map((route) => (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}
        {data.me.role === "Owner" &&
          ownerRoutes.map((route) => (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}
        {commonRoutes.map((route) => (
          <Route exact key={route.path} path={route.path}>
            {route.component}
          </Route>
        ))}
        <NotFound />
      </Switch>
    </Router>
  );
};
