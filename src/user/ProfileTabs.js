import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.png";

export class ProfileTabs extends Component {
  render() {
    const { following, followers, posts } = this.props;
    return (
      <div>
        <div className='row'>
          {/* follower */}
          <div className='col-md-4'>
            <h3 className='text-primary'>Followers</h3>
            <hr />
            {followers.map((person, index) => (
              <div key={index}>
                <div>
                  <Link to={`/users/${person._id}`}>
                    <img
                      style={{ borderRadius: "50%", border: "1px solid black" }}
                      className='float-left mr-2'
                      height='30px'
                      width='30px'
                      onError={image =>
                        (image.target.src = `${DefaultProfile}`)
                      }
                      src={`${process.env.REACT_APP_API_URL}/users/photo/${person._id}`}
                      alt={person.name}
                    />
                    <div>
                      <p className='lead'>{person.name}</p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* following */}
          <div className='col-md-4'>
            <h3 className='text-primary'>Following</h3>
            <hr />
            {following.map((person, index) => (
              <div key={index}>
                <div>
                  <Link to={`/user/${person._id}`}>
                    <img
                      style={{ borderRadius: "50%", border: "1px solid black" }}
                      className='float-left mr-2'
                      height='30px'
                      width='30px'
                      onError={image =>
                        (image.target.src = `${DefaultProfile}`)
                      }
                      src={`${process.env.REACT_APP_API_URL}/users/photo/${person._id}`}
                      alt={person.name}
                    />
                    <div>
                      <p className='lead'>{person.name}</p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* posts */}
          <div className='col-md-4'>
            <h3 className='text-primary'>Posts</h3>
            <hr />
            {posts.map((post, index) => (
              <div key={index}>
                <div>
                  <Link to={`/posts/${post._id}`}>
                    <div>
                      <p className='lead'>{post.title}</p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileTabs;
