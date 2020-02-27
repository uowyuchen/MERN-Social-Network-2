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

        {isAuthenticated() && (
          <Fragment>
            <li className='nav-item'>
              <a
                className='nav-link'
                style={
                  (isActive(history, "/signout"),
                  { cursor: "pointer", color: "#ffffff" })
                }
                onClick={() => signout(() => history.push("/"))}
              >
                Sign Out
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link'
                style={
                  (isActive(history, "/signout"),
                  { cursor: "pointer", color: "#ffffff" })
                }
              >
                Hello! {isAuthenticated().user.name}
              </a>
            </li>
          </Fragment>
        )}
      </ul>
    </div>
  );
};

export default withRouter(Menu);
