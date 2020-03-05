import React, { Component, Fragment } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.png";

export class Comment extends Component {
  state = {
    text: "",
    error: ""
  };

  handleChange = event => {
    this.setState({ error: "" });
    this.setState({ text: event.target.value });
  };
  addComment = event => {
    event.preventDefault();

    // 登录的user才能comment
    if (!isAuthenticated()) {
      this.setState({ error: "Please signin to leave a comment" });
      return false;
    }

    if (this.isValid()) {
      const userId = isAuthenticated().user.id;
      const postId = this.props.postId;
      const token = isAuthenticated().token;
      const commentContent = { text: this.state.text };

      // add comment with apiPost
      comment(userId, token, postId, commentContent).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ text: "" });
          // dispatch fresh list of comment to parent (SinglePost)
          this.props.updateComments(data.comments);
        }
      });
    }
  };

  isValid = () => {
    const { text } = this.state;
    if (!text.length > 0 || text.length > 150) {
      this.setState({
        error: "Comment should not be empty and less than 150 characters long"
      });
      return false;
    }
    return true;
  };

  // delete comment
  deleteConfirmed = comment => {
    let answer = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (answer) {
      this.deleteComment(comment);
    }
  };

  deleteComment = comment => {
    const userId = isAuthenticated().user.id;
    const postId = this.props.postId;
    const token = isAuthenticated().token;

    // add comment with apiPost
    uncomment(userId, token, postId, comment).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        // dispatch fresh list of comment to parent (SinglePost)
        this.props.updateComments(data.comments);
      }
    });
  };

  render() {
    const { comments } = this.props;
    const { error } = this.state;

    return (
      <div>
        <h2 className='mt-5 mb-5'>Leave a comment</h2>

        <form onSubmit={this.addComment}>
          <div className='form-group'>
            <input
              className='form-control'
              type='text'
              onChange={this.handleChange}
              value={this.state.text}
              placeholder='Leave a comment'
            />
          </div>
          <button className='btn btn-raised btn-success mb-3'>Post</button>
        </form>

        {/* display errors */}
        <div
          className='alert alert-danger'
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        <hr />
        <div className='col-md-12'>
          <h3 className='text-primary'>{comments.length} Comments</h3>
          <hr />
          {comments.map((comment, index) => (
            <div key={index}>
              <div>
                <Link to={`/user/${comment.postedBy._id}`}>
                  <img
                    style={{ borderRadius: "50%", border: "1px solid black" }}
                    className='float-left mr-2'
                    height='30px'
                    width='30px'
                    onError={image => (image.target.src = `${DefaultProfile}`)}
                    src={`${process.env.REACT_APP_API_URL}/users/photo/${comment.postedBy._id}`}
                    alt={comment.postedBy.name}
                  />{" "}
                </Link>

                <div>
                  <p className='lead'>{comment.text}</p>
                  <br />
                  <p className='font-italic mark'>
                    Posted by{" "}
                    <Link to={`/user/${comment.postedBy._id}`}>
                      {comment.postedBy.name}{" "}
                    </Link>
                    on {new Date(comment.created).toDateString()}
                    <span>
                      {/* show edit & delete button */}
                      {isAuthenticated().user &&
                        isAuthenticated().user.id === comment.postedBy._id && (
                          <Fragment>
                            <button
                              onClick={() => this.deleteConfirmed(comment)}
                              className='btn btn-raised btn-sm btn-danger float-right'
                            >
                              Remove
                            </button>
                          </Fragment>
                        )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Comment;
