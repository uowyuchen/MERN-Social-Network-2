import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { Redirect, Link } from "react-router-dom";
import { read } from "../user/apiUser";
import DefaultProfile from "../images/avatar.png";
import DeleteUser from "./DeleteUser";

export class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      redirectToSignin: false // 目的是：如果没signin，让其返回
    };
  }

  componentDidMount() {
    this.init(this.props.match.params.userId);
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.init(props.match.params.userId);
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        // 这里有错误🙅就说明user没有signin
        this.setState({ redirectToSignin: true });
      } else {
        // 没有错误就拿到了user info
        this.setState({ user: data });
      }
    });
  };

  render() {
    const redirectToSignin = this.state.redirectToSignin;
    if (redirectToSignin) return <Redirect to='/signin' />;
    const { user } = this.state;

    const photoUrl = this.state.user._id
      ? `${process.env.REACT_APP_API_URL}/users/photo/${
          this.state.user._id
        }?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Profile</h2>
        <div className='row'>
          <div className='col-md-6'>
            <img
              className='card-img-top'
              src={photoUrl}
              alt={user.name}
              style={{ width: "200px", height: "auto", objectFit: "cover" }}
              onError={image => (image.target.src = `${DefaultProfile}`)}
            />
          </div>
          <div className='col-md-6'>
            <div className='lead mt-2'>
              <p>Hello {user.name}</p>
              <p>Email: {user.email}</p>
              <p>{`Joined: ${new Date(
                this.state.user.created
              ).toDateString()}`}</p>
            </div>
            {/* 登录的user和当前页面的user是一个user就可以update，delete */}
            {isAuthenticated().user &&
              isAuthenticated().user._id === this.state.user._id && (
                <div className='d-inline-block'>
                  <Link
                    className='btn btn-raised btn-success mr-5'
                    to={`/user/edit/${this.state.user._id}`}
                  >
                    Edit Profile
                  </Link>
                  <DeleteUser />
                </div>
              )}
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12 mt-5 mb-5'>
            <hr />
            <p className='lead'>{user.about}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
