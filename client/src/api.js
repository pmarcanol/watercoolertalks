function Services() {
  let token = "pene";
  function Auth() {
    const { POST } = Fetch();
    return {
      signIn: async (username, password) => {
        try {
          const res = await (
            await POST("auth/login", { username, password }, { auth: false })
          ).json();
          console.log(res);
          token = res.data.user.token;
          return res.data.user;
        } catch (e) {
          console.error("could not sign in", e);
        }
      },
      register: async (username, password) => {
        try {
          const res = await POST(
            "auth/signup",
            { username, password },
            { auth: false }
          ).json();
          token = res.data.user.token;
          console.log(res);
        } catch (e) {
          console.error("could not register");
        }
      },
    };
  }
  function Fetch() {
    return {
      GET: (url, params, options = { auth: true }) => {
        const headers = {
          "Content-Type": "application/json",
        };
        if (options.auth) {
          headers.Authorization = `Bearer ${token}`;
        }
        return fetch(
          `${process.env.REACT_APP_API_URL}/api/${url}/${queryParams(params)}`,
          {
            method: "GET",
            headers,
          }
        );
      },
      POST: (url, body, options = { auth: true }) => {
        const headers = {
          "Content-Type": "application/json",
        };
        if (options.auth) {
          headers.Authorization = `Bearer ${token}`;
        }
        return fetch(`${process.env.REACT_APP_API_URL}/${url}`, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });
      },
    };
  }
  return {
    Auth,
    Fetch,
  };
}

function queryParams(params) {
  if (params) {
    return Object.keys(params).reduce(
      (accum, curr) => `${accum}&${curr}=${params[curr].toString()}`,
      "?"
    );
  } else {
    return "";
  }
}

const services = new Services();

module.exports.useAuth = services.Auth;
module.exports.useFetch = services.Fetch;
