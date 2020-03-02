// 提取出来read方法，read一个single user
export const read = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

// 提取出来list方法，list一个all users
export const list = () => {
  return fetch(`${process.env.REACT_APP_API_URL}/users`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

// 提取出来remove方法，remove一个single user
export const remove = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

// 提取出来update方法，update一个single user
export const update = (userId, token, userData) => {
  return fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      // "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: userData
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

// update user of local storage
export const updateUser = (user, cb) => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("jwt")) {
      let auth = JSON.parse(localStorage.getItem("jwt"));
      // auth里有一个token 和 一个user object
      auth.user = user;
      localStorage.setItem("jwt", JSON.stringify(auth));
      cb();
    }
  }
};

// follow button
export const follow = (userId, token, followId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/users/follow`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId, followId })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

// unfollow button
export const unfollow = (userId, token, unfollowId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/users/unfollow`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId, unfollowId })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

// find people
export const findPeople = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/users/findPeople/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
