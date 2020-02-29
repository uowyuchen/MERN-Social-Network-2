import React, { Component } from "react";
import { signup } from "../auth";
import { Link } from "react-router-dom";

export class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      open: false
    };
  }

  handlechange = event => {
    this.setState({ error: "" });
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    const { name, email, password } = this.state;
    const user = { name, email, password };

    signup(user).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({
          error: "",
          name: "",
          email: "",
          password: "",
          open: true
        });
      }
    });
  };

  render() {
    const { name, email, password, error, open } = this.state;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Signup</h2>

        {/* display errors */}
        <div
          className='alert alert-danger'
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {/* display success */}
        <div
          className='alert alert-info'
          style={{ display: open ? "" : "none" }}
        >
          New account is successfully created. Please
          <Link to='/signin'> Sign In</Link>.
        </div>

        <form onSubmit={this.handleSubmit}>
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

export default Signup;
