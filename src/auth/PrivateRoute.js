import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./index";

// 小写的是desctruct传过来的component，大写是rename他一下
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: "/signin", state: { from: props.location } }}
        />
      )
    }
  />
);

export default PrivateRoute;
