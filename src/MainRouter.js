import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Menu from "./core/Menu";
import Profile from "./user/Profile";
import GetAllUsers from "./user/GetAllUsers";
import EditProfile from "./user/EditProfile";
import FindUnfollowedPeople from "./user/FindUnfollowedPeople";
import PrivateRoute from "./auth/PrivateRoute";

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path='/signup' component={Signup}></Route>
        <Route exact path='/signin' component={Signin}></Route>
        <PrivateRoute
          exact
          path='/user/:userId'
          component={Profile}
        ></PrivateRoute>
        <PrivateRoute
          exact
          path='/user/edit/:userId'
          component={EditProfile}
        ></PrivateRoute>
        <PrivateRoute
          exact
          path='/findpeople'
          component={FindUnfollowedPeople}
        ></PrivateRoute>
        <Route exact path='/users' component={GetAllUsers}></Route>
        <Route path='/' component={Home}></Route>
      </Switch>
    </div>
  );
};

export default MainRouter;
