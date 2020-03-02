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
            <li className='nav-item'>
              <Link
                className='nav-link'
                to={`/user/${isAuthenticated().user._id}`}
                style={isActive(history, `/user/${isAuthenticated().user._id}`)}
              >
                {`${isAuthenticated().user.name}'s Profile`}
              </Link>
            </li>

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
