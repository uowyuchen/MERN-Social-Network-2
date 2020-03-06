import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { Redirect, Link } from "react-router-dom";
import { read } from "./apiUser";
import DefaultProfile from "../images/avatar.png";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import ProfileTabs from "./ProfileTabs";
import { listByUser } from "../post/apiPost";

export class Profile extends Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      user: { following: [], followers: [] }, // 这个user是别人
      redirectToSignin: false, // 目的是：如果没signin，让其返回
      following: false, // 一开始都是unfollow的状态，所以false
      error: "",
      posts: []
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.init(this.props.match.params.userId);
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps.match.params.userId);
    //console.log("next props", nextProps.match.params.userId);
  }

  // 这个init方法是我们要读取我们看的那个 user的profile，我们可能会follow这个人
  // 再解释一下：这个init就是，我们看谁的profile，就通过那个人的id 读取那个人的profile
  init = userId => {
    const token = isAuthenticated().token;
    // get single user
    read(userId, token).then(data => {
      if (data.error) {
        // 这里有错误🙅就说明user没有signin
        this.setState({ redirectToSignin: true });
      } else {
        if (this._isMounted) {
          let following = this.checkFollow(data);
          // 没有错误就拿到了user info
          this.setState({ user: data, following });
          // get single user's posts
          this.loadPosts(data._id);
        }
      }
    });
  };

  loadPosts = userId => {
    const token = isAuthenticated().token;
    listByUser(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  // check if already follow; 这个user是上面👆那个init拿过来的data，就是user object
  checkFollow = user => {
    // 检查我要follow的那个人的follower list里面有没有我
    // console.log(user.followers);
    return user.followers.find(
      // 检查有没有我的userId，我=》指的是当前登录的user
      follower => follower._id === isAuthenticated().user.id
    );
  };

  // follow button functin
  clickFollowButton = callApi => {
    // 这个是当前登录的user的🆔
    const userId = isAuthenticated().user.id;
    const token = isAuthenticated().token;
    // 这个是你要follow的那个人的🆔
    const followId = this.props.match.params.userId;

    callApi(userId, token, followId).then(data => {
      if (data.error || undefined) {
        this.setState({ error: data.error });
      } else {
        this.setState({ user: data, following: !this.state.following });
      }
    });
  };

  render() {
    const redirectToSignin = this.state.redirectToSignin;
    if (redirectToSignin) return <Redirect to='/signin' />;
    const { user, posts } = this.state;

    const photoUrl = this.state.user._id
      ? `${process.env.REACT_APP_API_URL}/users/photo/${
          this.state.user._id
        }?${new Date().getTime()}`
      : DefaultProfile;
    // console.log(user);
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Profile</h2>
        <div className='row'>
          <div className='col-md-4'>
            <img
              className='card-img-top'
              src={photoUrl}
              alt={user.name}
              style={{ width: "200px", height: "auto", objectFit: "cover" }}
              onError={image => (image.target.src = `${DefaultProfile}`)}
            />
          </div>

          <div className='col-md-8'>
            {/* 显示个人信息：name, email, created date */}
            <div className='lead mt-2'>
              <p>Hello {user.name}</p>
              <p>Email: {user.email}</p>
              <p>{`Joined: ${new Date(
                this.state.user.created
              ).toDateString()}`}</p>
            </div>

            {/* 登录的user和当前页面的user是一个user就可以update，delete */}
            {isAuthenticated().user &&
            isAuthenticated().user.id === this.state.user._id ? (
              <div className='d-inline-block'>
                <Link
                  className='btn btn-raised btn-info mr-5'
                  to={`/post/create`}
                >
                  Create Post
                </Link>
                <Link
                  className='btn btn-raised btn-success mr-5'
                  to={`/user/edit/${this.state.user._id}`}
                >
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            ) : (
              <FollowProfileButton
                following={this.state.following}
                onButtonClick={this.clickFollowButton}
              />
            )}

            {/* admin user 的 update，delete */}
            <div>
              {isAuthenticated().user &&
                isAuthenticated().user.role === "admin" && (
                  <div className='card mt-5'>
                    <div className='card-body'>
                      <h5 className='card-title'>Admin</h5>
                      <p className='mb-2 text-danger'>
                        Edit/Delete as an Admin
                      </p>
                      <Link
                        className='btn btn-raised btn-success mr-5'
                        to={`/user/edit/${user._id}`}
                      >
                        Edit Profile
                      </Link>
                      <DeleteUser
                        user={user}
                        userId={this.props.match.params.userId}
                      />
                    </div>
                  </div>
                )}
            </div>
            <hr />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12 mt-5 mb-5'>
            <hr />
            <p className='lead'>{user.about}</p>
            <hr />
            <ProfileTabs
              followers={user.followers}
              following={user.following}
              posts={posts}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
