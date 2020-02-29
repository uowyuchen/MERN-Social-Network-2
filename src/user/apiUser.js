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
