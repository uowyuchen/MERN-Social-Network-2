import React, { Component } from "react";
import { list } from "./apiPost";
import DefaultPost from "../images/pingping.jpg";
import { Link } from "react-router-dom";

export class GetAllPosts extends Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      posts: [],
      page: 1
    };
  }

  loadPosts = page => {
    list(page).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  loadMore = number => {
    this.setState({ page: this.state.page + number });
    this.loadPosts(this.state.page + number);
  };

  loadLess = number => {
    this.setState({ page: this.state.page - number });
    this.loadPosts(this.state.page - number);
  };

  componentDidMount() {
    this._isMounted = true;
    this.loadPosts(this.state.page);
    // list()
    //   .then(data => {
    //     if (data.error || undefined) return console.log(data.error);
    //     if (this._isMounted) {
    //       this.setState({ posts: data });
    //     }
    //   })
    //   .catch(err => console.log(err));
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  renderPosts = posts => {
    return (
      <div className='row'>
        {posts.map((post, index) => {
          const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
          const posterName = post.postedBy ? post.postedBy.name : " Unknown";
          return (
            <div className='card col-md-4' key={index}>
              <div className='card-body'>
                <img
                  src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                  alt={post.title}
                  onError={image => (image.target.src = `${DefaultPost}`)}
                  className='img-thumbnail mb-3'
                  style={{ height: "200px", width: "100%" }}
                />

                {/* show posts */}
                <h5 className='card-title'>{post.title}</h5>
                <p className='card-text'>{post.body.substring(0, 2)}...</p>
                <br />
                <p className='font-italic mark'>
                  Posted by <Link to={`${posterId}`}>{posterName} </Link>
                  on {new Date(post.created).toDateString()}
                </p>
                <Link
                  to={`/posts/${post._id}`}
                  className='btn btn-raised btn-sm btn-primary'
                >
                  Read More
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts, page } = this.state;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>
          {!posts.length ? "No more posts!" : "Recent Posts"}
        </h2>

        {this.renderPosts(posts)}

        {page > 1 ? (
          <button
            className='btn btn-raised btn-warning mr-5 mt-5 mb-5'
            onClick={() => this.loadLess(1)}
          >
            Previous ({this.state.page - 1})
          </button>
        ) : (
          ""
        )}

        {posts.length && posts.length == 3 ? (
          <button
            className='btn btn-raised btn-success mt-5 mb-5'
            onClick={() => this.loadMore(1)}
          >
            Next (Go to Page {page + 1})
          </button>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default GetAllPosts;
