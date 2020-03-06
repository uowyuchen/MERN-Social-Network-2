import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};

const Menu = ({ history }) => {
  return (
    <div>
      <ul className='nav nav-tabs bg-primary'>
        <li className='nav-item'>
          <Link className='nav-link' style={isActive(history, "/")} to='/'>
            Home
          </Link>
        </li>

        {/* Get All Users */}
        <li className='nav-item'>
          <Link
            className='nav-link'
            style={isActive(history, "/users")}
            to='/users'
          >
            Users
          </Link>
        </li>

        {/* Get All Unfollowed Users */}
        <li className='nav-item'>
          <Link
            className='nav-link'
            style={isActive(history, "/findpeople")}
            to='/findpeople'
          >
            Unfollowed Users
          </Link>
        </li>

        {/* Create a New Post */}
        <li className='nav-item'>
          <Link
            className='nav-link'
            style={isActive(history, "/post/create")}
            to='/post/create'
          >
            Create Post
          </Link>
        </li>

        {/* Signup & Signin */}
        {!isAuthenticated() && (
          <Fragment>
            <li className='nav-item'>
              <Link
                className='nav-link'
                style={isActive(history, "/signin")}
                to='/signin'
              >
                Sign In
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className='nav-link'
                style={isActive(history, "/signup")}
                to='/signup'
              >
                Sign Up
              </Link>
            </li>
          </Fragment>
        )}

        {/* Signout & Show Profile */}
        {isAuthenticated() && (
          <Fragment>
            {console.log(isAuthenticated())}
            <li className='nav-item'>
              <Link
                className='nav-link'
                to={
                  isAuthenticated().user.id
                    ? `/user/${isAuthenticated().user.id}`
                    : `/user/${isAuthenticated().user._id}`
                }
                style={isActive(
                  history,
                  isAuthenticated().user.id
                    ? `/user/${isAuthenticated().user.id}`
                    : `/user/${isAuthenticated().user._id}`
                )}
              >
                {`${isAuthenticated().user.name}'s Profile`}
              </Link>
            </li>

            {/* admin access */}
            {isAuthenticated() && isAuthenticated().user.role === "admin" && (
              <li className='nav-item'>
                <Link
                  to={`/admin`}
                  style={isActive(history, `/admin`)}
                  className='nav-link'
                >
                  Admin
                </Link>
              </li>
            )}

            <li className='nav-item'>
              <span
                className='nav-link'
                style={
                  (isActive(history, "/signout"),
                  { cursor: "pointer", color: "#ffffff" })
                }
                onClick={() => signout(() => history.push("/"))}
              >
                Sign Out
              </span>
            </li>
          </Fragment>
        )}
      </ul>
    </div>
  );
};

export default withRouter(Menu);
