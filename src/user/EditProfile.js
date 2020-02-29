import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { read, update, updateUser } from "../user/apiUser";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../images/avatar.png";

export class EditProfile extends Component {
  constructor() {
    super();

    this.state = {
      id: "",
      name: "",
      email: "",
      about: "",
      password: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false
    };
  }

  componentDidMount() {
    // 因为这次还需要上传⏫图片，所以需要用FormData
    this.userData = new FormData();
    // console.log("1", this.userData);
    this.init(this.props.match.params.userId);
  }

  // 这一步为了一开始就加载数据，在form中显示
  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        // 这里有错误🙅就说明user没有signin
        this.setState({ redirectToProfile: true });
      } else {
        // 没有错误,成功更新之后就redirect到此更新的profile
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
          error: ""
        });
      }
    });
  };

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
    this.userData.set(event.target.name, value);

    this.setState({ [event.target.name]: value, fileSize: fileSize });
  };

  handleSubmit = event => {
    event.preventDefault();

    this.setState({ loading: true });

    if (this.isValid()) {
      const token = isAuthenticated().token;
      const userId = this.props.match.params.userId;
      // const { name, email, password } = this.state;
      // const user = { name, email, password: password || undefined };

      update(userId, token, this.userData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          // 返回的data就是user object

          updateUser(data, () => {
            // 没有错误,成功更新之后就redirect到此更新的profile
            this.setState({ redirectToProfile: true });
          });
        }
      });
    }
  };

  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 2000000) {
      this.setState({
        error: "File size should be less than 2000kb",
        loading: false
      });
      return false;
    }
    if (name.length === 0) {
      this.setState({ error: "Name is required", loading: false });
      return false;
    }
    if (
      !/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email)
    ) {
      this.setState({ error: "A valid Email is required", loading: false });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: "Password must be at least 6 characters long",
        loading: false
      });
      return false;
    }
    return true;
  };

  render() {
    const {
      id,
      name,
      email,
      about,
      password,
      redirectToProfile,
      error,
      loading
    } = this.state;
    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/users/photo/${id}?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <div className='container'>
        <h2 className='mb-5 mt-5'>EditProfile</h2>

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

        {/* Avatar Image Preview */}
        <img
          src={photoUrl}
          alt={name}
          style={{ height: "200px", width: "auto" }}
          onError={image => (image.target.src = `${DefaultProfile}`)}
        />

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
            <label className='text-muted'>Name</label>
            <input
              type='text'
              className='form-control'
              name='name'
              onChange={this.handlechange}
              value={name}
            />
          </div>
          <div className='form-group'>
            <label className='text-muted'>Email</label>
            <input
              type='email'
              className='form-control'
              name='email'
              onChange={this.handlechange}
              value={email}
            />
          </div>
          <div className='form-group'>
            <label className='text-muted'>About</label>
            <textarea
              type='text'
              className='form-control'
              name='about'
              onChange={this.handlechange}
              value={about}
            />
          </div>
          <div className='form-group'>
            <label className='text-muted'>Password</label>
            <input
              type='password'
              className='form-control'
              name='password'
              onChange={this.handlechange}
              value={password}
            />
          </div>

          <button className='btn btn-raised btn-primary'>Update</button>
        </form>
      </div>
    );
  }
}

export default EditProfile;
