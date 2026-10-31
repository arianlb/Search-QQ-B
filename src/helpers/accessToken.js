const axios = require("axios");


const getAccessToken1 = async (user, password) => {
  const params = new URLSearchParams();
  params.append("client_id", process.env.QQ1_CLIENT_ID);
  params.append("client_secret", process.env.QQ1_CLIENT_SECRET);
  params.append("grant_type", "password");
  params.append("username", user);
  params.append("password", password);

  try {
    const response = await axios.post(
      "https://login.qqcatalyst.com/oauth/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return response.data.access_token;
  } catch (error) {
    throw new Error("Failed to fetch access token QQ-1");
  }
};

const getAccessToken2 = async (user, password) => {
  const params = new URLSearchParams();
  params.append("client_id", process.env.QQ2_CLIENT_ID);
  params.append("client_secret", process.env.QQ2_CLIENT_SECRET);
  params.append("grant_type", "password");
  params.append("username", user);
  params.append("password", password);

  try {
    const response = await axios.post(
      "https://login.qqcatalyst.com/oauth/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return response.data.access_token;
  } catch (error) {
    throw new Error("Failed to fetch access token QQ-2");
  }
};

module.exports = {
  getAccessToken1,
  getAccessToken2,
};