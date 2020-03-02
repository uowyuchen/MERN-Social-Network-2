import React, { Component } from "react";
import { findPeople, follow } from "./apiUser";
import DefaultProfile from "../images/avatar.png";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";

export class FindUnfollowedPeople extends Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      users: [],
      error: "",
      open: false,
      followMessage: ""
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    findPeople(userId, token)
      .then(data => {
        if (data.error || undefined) return console.log(data.error);
        this.setState({ users: data });
      })
      .catch(err => console.log(err));
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  clickFollow = (user, index) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    follow(userId, token, user._id).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        let notFollowedUsers = this.state.users;
        // 在没有被follow的users中，删掉我们刚才follow的那个；通过index删
        notFollowedUsers.splice(index, 1);
        this.setState({
          users: notFollowedUsers,
          open: true,
          followMessage: `Following ${user.name}`
        });
      }
    });
  };

  renderUsers = users => (
    <div className='row'>
      {users.map((user, index) => (
        <div className='card col-md-4' key={index}>
          <img
            className='card-img-top'
            src={`${process.env.REACT_APP_API_URL}/users/photo/${
              user._id
            }?${new Date().getTime()}`}
            alt={user.name}
            style={{ width: "100%", height: "15vw", objectFit: "cover" }}
            onError={image => (image.target.src = `${DefaultProfile}`)}
          />
          <div className='card-body'>
            <h5 className='card-title'>{user.name}</h5>
            <p className='card-text'>{user.email}</p>
            <Link
              to={`/user/${user._id}`}
              className='btn btn-raised btn-sm btn-primary'
            >
              View Profile
            </Link>

            <button
              onClick={() => this.clickFollow(user, index)}
              className='btn btn-raised btn-info float-right btn-sm'
            >
              Follow
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const { users, open, followMessage } = this.state;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Unfollowed Users</h2>

        {open && (
          <div className='alert alert-success'>{<p>{followMessage}</p>}</div>
        )}

        {this.renderUsers(users)}
      </div>
    );
  }
}

export default FindUnfollowedPeople;
