import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../images/pingping.jpg";

export class EditPost extends Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      id: "",
      title: "",
      body: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    // 因为这次还需要上传⏫图片，所以需要用FormData
    this.postData = new FormData();
    // console.log("1", this.userData);
    this.init(this.props.match.params.postId);
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  // 这一步为了一开始就加载数据，在form中显示
  init = postId => {
    singlePost(postId).then(data => {
      if (data.error) {
        // 这里有错误🙅就说明user没有signin
        this.setState({ redirectToProfile: true });
      } else {
        // 没有错误,成功更新之后就redirect到此更新的profile
        if (this._isMounted) {
          this.setState({
            id: data.postedBy._id,
            title: data.title,
            body: data.body,
            error: ""
          });
        }
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
    this.postData.set(event.target.name, value);

    this.setState({ [event.target.name]: value, fileSize: fileSize });
  };

  handleSubmit = event => {
    event.preventDefault();

    this.setState({ loading: true });

    if (this.isValid()) {
      const token = isAuthenticated().token;
      const postId = this.props.match.params.postId; // 这个user即将creates post

      update(postId, token, this.postData).then(data => {
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

  editPostForm = (title, body) => (
    /* Edit Post Form */
    <form onSubmit={this.handleSubmit}>
      <div className='form-group'>
        <label className='text-muted'>Post Photo</label>
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

      <button className='btn btn-raised btn-primary'>Update Post</button>
    </form>
  );

  render() {
    const { id, title, body, redirectToProfile, error, loading } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/posts/${this.props.match.params.postId}`} />;
    }
    return (
      <div className='container'>
        <h2 className='mt-2 mb-2'>{title}</h2>

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

        <img
          src={`${process.env.REACT_APP_API_URL}/post/photo/${
            this.props.match.params.postId
          }?${new Date().getTime()}`}
          alt={title}
          style={{ height: "200px", width: "auto" }}
          onError={image => (image.target.src = `${DefaultProfile}`)}
        />

        {isAuthenticated().user.role === "admin" &&
          this.editPostForm(title, body)}

        {isAuthenticated().user.id === id && this.editPostForm(title, body)}
      </div>
    );
  }
}

export default EditPost;
