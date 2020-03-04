// 提取出来create post方法
export const create = (userId, token, post) => {
  return fetch(`${process.env.REACT_APP_API_URL}/post/new/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      // "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: post
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

// 提取出来list方法，list一个all posts
export const list = async () => {
  return await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

// 提取出来read方法，read一个single user
export const singlePost = postId => {
  return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

// 提取出来list by user 方法，list一个all posts by a user
export const listByUser = async (userId, token) => {
  return await fetch(`${process.env.REACT_APP_API_URL}/posts/by/${userId}`, {
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

// 提取出来remove方法，remove一个single post
export const remove = (postId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
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

// 提取出来update方法，update一个single post
export const update = (postId, token, postData) => {
  return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      // "Content-Type": "application/json", // 因为这是formdata
      Authorization: `Bearer ${token}`
    },
    body: postData
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

// 提取出来like方法
export const like = (userId, token, postId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/post/like`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json", // 因为这是formdata
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId, postId })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

// 提取出来unlike方法
export const unlike = (userId, token, postId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/post/unlike`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json", // 因为这是formdata
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId, postId })
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
