export const signup = user => {
  // 这个其实就是模仿postman
  return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const signin = user => {
  // 这个其实就是模仿postman
  // console.log("1", process.env.REACT_APP_API_URL);
  return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const authenticate = (jwt, cb) => {
  // 因为有的时候component正在mounting的时候，window object isnot available；所以这一步很重要
  if (typeof window !== "undefined") {
    console.log("2", jwt);
    localStorage.setItem("jwt", JSON.stringify(jwt));
    cb();
  }
};

export const signout = cb => {
  if (typeof window !== "undefined") {
    // clinet side: remove jwt in local storage
    localStorage.removeItem("jwt");
    cb();
    // server side: send a request
    return fetch(`${process.env.REACT_APP_API_URL}/signout`, {
      method: "GET"
    })
      .then(response => {
        console.log("signout", response);
        return response.json();
      })
      .catch(err => console.log(err));
  }
};

// isAuthenticated是判断user有没有login；
// 之前的authenticate是把正在登录的user的token放进local storage中
export const isAuthenticated = () => {
  if (typeof window == "undefined") return false;
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};
