const axios = require("axios");

const getAccessToken89 = async () => {
  const params = new URLSearchParams();
  params.append("client_id", process.env.QQ1_CLIENT_ID);
  params.append("client_secret", process.env.QQ1_CLIENT_SECRET);
  params.append("grant_type", "password");
  params.append("username", process.env.QQ89_USER);
  params.append("password", process.env.QQ89_PASSWORD);

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

const getAccessToken117 = async () => {
  const params = new URLSearchParams();
  params.append("client_id", process.env.QQ2_CLIENT_ID);
  params.append("client_secret", process.env.QQ2_CLIENT_SECRET);
  params.append("grant_type", "password");
  params.append("username", process.env.QQ117_USER);
  params.append("password", process.env.QQ117_PASSWORD);

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

const getAccessToken = async (office) => {
  if (office === 89) {
    return getAccessToken89();
  } else if (office === 117) {
    return getAccessToken117();
  } else {
    return null; // or throw an error if the office is not recognized
  }
};

module.exports = {
  getAccessToken,
};