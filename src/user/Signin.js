import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { signin, authenticate } from "../auth";

export class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      redirectToReferer: false,
      loading: false
    };
  }

  handlechange = event => {
    this.setState({ error: "" });
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = { email, password };

    signin(user).then(data => {
      if (data.error) {
        this.setState({ error: data.error, loading: false });
      } else {
        // if signin successfully
        // authenticate:就是把后台传过来user成功signin的token保存到local storage
        authenticate(data, () => {
          // redirect
          this.setState({ redirectToReferer: true });
        });
      }
    });
  };

  render() {
    const { email, password, error, redirectToReferer, loading } = this.state;

    if (redirectToReferer) {
      return <Redirect to='/' />;
    }

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Signin</h2>

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

        <form onSubmit={this.handleSubmit}>
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
            <label className='text-muted'>Password</label>
            <input
              type='password'
              className='form-control'
              name='password'
              onChange={this.handlechange}
              value={password}
            />
          </div>
          <button className='btn btn-raised btn-primary'>Submit</button>
        </form>
      </div>
    );
  }
}

export default Signin;
