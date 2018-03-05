const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

export const http = {
  get: (url) => {
    return fetch(url, {
      headers: headers,
      credentials: 'include'
    })
    .then((response) => response.json());
  },
  post: (url, data) => {
    return fetch(url, {
      headers: headers,
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data)
    }).then((response) => response.json());
  },
  image: (url, data, type) => {
    return fetch(url, {
      headers: {
        'Content-Type': type
      },
      method: 'PUT',
      body: data
    }).then((response) => response);
  }
}
