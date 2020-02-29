import React, { Component } from "react";
import { list } from "./apiUser";
import DefaultProfile from "../images/avatar.png";
import { Link } from "react-router-dom";

export class GetAllUsers extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    list()
      .then(data => {
        if (data.error) return console.log(data.error);
        this.setState({ users: data });
      })
      .catch(err => console.log(err));
  }

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
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const { users } = this.state;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Users</h2>
        {this.renderUsers(users)}
      </div>
    );
  }
}

export default GetAllUsers;
