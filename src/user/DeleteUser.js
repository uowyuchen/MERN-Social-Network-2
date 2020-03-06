import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { remove } from "./apiUser";
import { signout } from "../auth";
import { Redirect } from "react-router-dom";

export class DeleteUser extends Component {
  state = { redirect: false };

  deleteConfirmed = () => {
    let answer = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (answer) {
      this.deleteAccount();
    }
  };

  deleteAccount = () => {
    const token = isAuthenticated().token;
    const userId = this.props.userId;

    console.log(isAuthenticated().user.role);
    remove(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        // 有条件的 signout user；如果是admin就不signout了
        if (!isAuthenticated().user.role === "admin") {
          signout(() => {
            console.log("User is deleted");
          });
        }
        // redirect
        this.setState({ redirect: true });
      }
    });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to='/' />;
    }
    return (
      <button
        onClick={this.deleteConfirmed}
        className='btn btn-raised btn-danger'
      >
        Delete Profile
      </button>
    );
  }
}

export default DeleteUser;
