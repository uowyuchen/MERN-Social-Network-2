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
import NewPost from "./post/NewPost";
import SinglePost from "./post/SinglePost";
import EditPost from "./post/EditPost";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";

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
        <PrivateRoute
          exact
          path='/post/create'
          component={NewPost}
        ></PrivateRoute>
        {/* edit a post */}
        <PrivateRoute
          exact
          path='/posts/edit/:postId'
          component={EditPost}
        ></PrivateRoute>
        {/* get all users */}
        <Route exact path='/users' component={GetAllUsers}></Route>
        <Route exact path='/posts/:postId' component={SinglePost}></Route>
        {/* forgot password route */}
        <Route exact path='/forgot-password' component={ForgotPassword} />{" "}
        {/* reset password route */}
        <Route
          exact
          path='/reset-password/:resetPasswordToken'
          component={ResetPassword}
        />
        <Route path='/' component={Home}></Route>
      </Switch>
    </div>
  );
};

export default MainRouter;
