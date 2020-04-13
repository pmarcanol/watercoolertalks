function Services() {
  let token = "pene";
  function Auth() {
    const { POST } = Fetch();
    return {
      signIn: async (username, password) => {
        try {

          const res = await (
            await POST("auth/login", { username, password })
          ).json();
          console.log(res)
          token = res.data.user.token;
          return res.data.user;
        } catch (e) {
            console.error("could not sign in");
        }
      },
      register: async (username, password) => {
        try {
          const res = await POST("auth/signup", { username, password }).json();
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
      GET: (url, params) =>
        fetch(
          `${process.env.REACT_APP_API_URL}/api/${url}/${queryParams(params)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      POST: (url, body) =>
        fetch(`${process.env.REACT_APP_API_URL}/${url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //   Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify(body),
        }),
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
    return '';
  }
}

const services = new Services();

module.exports.useAuth = services.Auth;
module.exports.useFetch = services.Fetch;
