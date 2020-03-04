import React, { Component, Fragment } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import DefaultPost from "../images/pingping.jpg";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";

export class SinglePost extends Component {
  _isMounted = false;
  state = {
    post: "",
    redirectToHome: false,
    redirectSignin: false,
    like: false,
    likes: 0
  };

  checkLike = likes => {
    const userId = isAuthenticated() && isAuthenticated().user.id;
    // 在likes这个array中找元素
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  componentDidMount = () => {
    this._isMounted = true;
    singlePost(this.props.match.params.postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        if (this._isMounted) {
          this.setState({
            post: data,
            likes: data.likes.length,
            like: this.checkLike(data.likes)
          });
        }
      }
    });
  };
  componentWillUnmount() {
    this._isMounted = false;
  }

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete this post?");
    if (answer) {
      this.deletePost();
    }
  };

  deletePost = () => {
    remove(this.props.match.params.postId, isAuthenticated().token).then(
      data => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ redirectToHome: true });
        }
      }
    );
  };

  likeTggle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectSignin: true });
      return false;
    }

    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user.id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;
    callApi(userId, token, postId).then(data => {
      if (data.err) {
        console.log(data.err);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length
        });
      }
    });
  };

  renderPost = post => {
    const { like, likes } = this.state;

    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : " Unknown";

    return (
      <div className='card-body'>
        {/* show post image */}
        <img
          src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
          alt={post.title}
          onError={image => (image.target.src = `${DefaultPost}`)}
          className='img-thumbnail mb-3'
          style={{ height: "300px", width: "100%", objectFit: "cover" }}
        />

        {/* show likes */}
        {like ? (
          <h3 onClick={this.likeTggle}>
            <i
              className='fa fa-thumbs-up text-success bg-dark'
              style={{ padding: "10px", borderRadius: "50%" }}
            />{" "}
            {likes} Like
          </h3>
        ) : (
          <h3 onClick={this.likeTggle}>
            <i
              className='fa fa-thumbs-up text-warning bg-dark'
              style={{ padding: "10px", borderRadius: "50%" }}
            />{" "}
            {likes} Like
          </h3>
        )}

        {/* show posts */}
        <p className='card-text'>{post.body}</p>
        <br />
        <p className='font-italic mark'>
          Posted by <Link to={`${posterId}`}>{posterName} </Link>
          on {new Date(post.created).toDateString()}
        </p>
        <div className='d-inline-block'>
          <Link to={`/`} className='btn btn-raised btn-sm btn-primary mr-5'>
            Back to Posts
          </Link>

          {/* show edit & delete button */}
          {isAuthenticated().user &&
            isAuthenticated().user.id === post.postedBy._id && (
              <Fragment>
                <Link
                  to={`/posts/edit/${post._id}`}
                  className='btn btn-raised btn-sm btn-warning mr-5'
                >
                  Update Post
                </Link>
                <button
                  onClick={this.deleteConfirmed}
                  className='btn btn-raised btn-sm btn-danger'
                >
                  Delete Post
                </button>
              </Fragment>
            )}
        </div>
      </div>
    );
  };

  render() {
    const { post, redirectToHome, redirectSignin } = this.state;

    if (redirectToHome) {
      return <Redirect to={`/`} />;
    } else if (redirectSignin) {
      return <Redirect to={`/signin`} />;
    }
    return (
      <div className='container'>
        <h2 className='display-4 mt-1 mb-1'>{post.title}</h2>

        {/* loading */}
        {!post ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderPost(post)
        )}
      </div>
    );
  }
}

export default SinglePost;
