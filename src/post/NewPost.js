import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { create } from "./apiPost";
import { Redirect } from "react-router-dom";

export class NewPost extends Component {
  _isMounted = false;
  constructor() {
    super();

    this.state = {
      title: "",
      body: "",
      photo: "",
      error: "",
      user: {}, // which user creates this post
      fileSize: 0,
      loading: false,
      redirectToProfile: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    // 因为这次还需要上传⏫图片，所以需要用FormData
    this.postData = new FormData();
    // 初始化C时，把当前登录的user赋值给state
    this.setState({ user: isAuthenticated().user });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  handlechange = event => {
    this.setState({ error: "" });
    // 这一步用三元运算来判断form表单中是用户的输入(input)还是file
    const value =
      event.target.name === "photo"
        ? event.target.files[0]
        : event.target.value;

    // 拿到 file size
    const fileSize =
      event.target.name === "photo" ? event.target.files[0].size : 0;

    // 这一步跟下面下行的[]中括号一样，都是变化着给userData的key paire赋值
    this.postData.set(event.target.name, value);

    this.setState({ [event.target.name]: value, fileSize: fileSize });
  };

  handleSubmit = event => {
    event.preventDefault();

    this.setState({ loading: true });

    if (this.isValid()) {
      const token = isAuthenticated().token;
      const userId = isAuthenticated().user.id; // 这个user即将creates post
      // const { name, email, password } = this.state;
      // const user = { name, email, password: password || undefined };
      // console.log(userId);
      // console.log(isAuthenticated());
      create(userId, token, this.postData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          // 返回的data就是post object
          this.setState({
            loading: false,
            title: "",
            body: "",
            photo: "",
            redirectToProfile: true
          });
        }
      });
    }
  };

  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (fileSize > 2000000) {
      this.setState({
        error: "File size should be less than 2000kb",
        loading: false
      });
      return false;
    }
    if (title.length === 0 || body.length === 0) {
      this.setState({ error: "All fields are required", loading: false });
      return false;
    }

    return true;
  };

  render() {
    const { title, body, user, error, loading, redirectToProfile } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${user.id}`} />;
    }

    return (
      <div className='container'>
        <h2 className='mb-5 mt-5'>Create a New Post</h2>

        {/* display errors */}
        <div
          className='alert alert-danger'
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {/* loading */}
        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          ""
        )}

        {/* Edit Profile Form */}
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label className='text-muted'>Profile Photo</label>
            <input
              type='file'
              className='form-control'
              name='photo'
              onChange={this.handlechange}
              accept='image/*'
              // value={name}
            />
          </div>
          <div className='form-group'>
            <label className='text-muted'>Title</label>
            <input
              type='text'
              className='form-control'
              name='title'
              onChange={this.handlechange}
              value={title}
            />
          </div>

          <div className='form-group'>
            <label className='text-muted'>Body</label>
            <textarea
              type='text'
              className='form-control'
              name='body'
              onChange={this.handlechange}
              value={body}
            />
          </div>

          <button className='btn btn-raised btn-primary'>Create Post</button>
        </form>
      </div>
    );
  }
}

export default NewPost;
