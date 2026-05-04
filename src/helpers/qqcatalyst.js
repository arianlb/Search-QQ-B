const axios = require("axios");
let accessToken1;
let accessToken2;

const getAccessToken1 = async () => {
  const params = new URLSearchParams();
  params.append("client_id", process.env.QQ1_CLIENT_ID);
  params.append("client_secret", process.env.QQ1_CLIENT_SECRET);
  params.append("grant_type", "password");
  params.append("username", process.env.QQ1_USER);
  params.append("password", process.env.QQ1_PASSWORD);

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

const getAccessToken2 = async () => {
  const params = new URLSearchParams();
  params.append("client_id", process.env.QQ2_CLIENT_ID);
  params.append("client_secret", process.env.QQ2_CLIENT_SECRET);
  params.append("grant_type", "password");
  params.append("username", process.env.QQ2_USER);
  params.append("password", process.env.QQ2_PASSWORD);

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

const qqCatalystRequest1 = async (criteria) => {
  if (!accessToken1) {
    accessToken1 = await getAccessToken1();
  }

  const headers = {
    Authorization: `Bearer ${accessToken1}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(
      `https://api.qqcatalyst.com/v1/Search?searchString=${criteria}&locationID=18437`,
      { headers },
    );
    return response.data.Contacts;
  } catch (error) {
    if (error.status === 401) {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      accessToken1 = await getAccessToken1();
      headers.Authorization = `Bearer ${accessToken1}`;
    }

    try {
      const response = await axios.get(
        `https://api.qqcatalyst.com/v1/Search?searchString=${criteria}&locationID=18437`,
        { headers },
      );
      return response.data.Contacts;
    } catch (error) {
      throw new Error("Failed to fetch from QQCatalyst after token refresh");
    }
  }
};

const qqCatalystRequest2 = async (criteria) => {
  if (!accessToken2) {
    accessToken2 = await getAccessToken2();
  }

  const headers = {
    Authorization: `Bearer ${accessToken2}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(
      `https://api.qqcatalyst.com/v1/Search?searchString=${criteria}&locationID=1`,
      { headers },
    );
    return response.data.Contacts;
  } catch (error) {
    if (error.status === 401) {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      accessToken2 = await getAccessToken2();
      headers.Authorization = `Bearer ${accessToken2}`;
    }

    try {
      const response = await axios.get(
        `https://api.qqcatalyst.com/v1/Search?searchString=${criteria}&locationID=1`,
        { headers },
      );
      return response.data.Contacts;
    } catch (error) {
      throw new Error("Failed to fetch from QQCatalyst after token refresh");
    }
  }
};

const qqCatalystRequestPolicies1 = async (customerId) => {
  if (!accessToken1) {
    accessToken1 = await getAccessToken1();
  }

  const headers = {
    Authorization: `Bearer ${accessToken1}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(
      `https://api.qqcatalyst.com/v1/Policies/ByCustomer/${customerId}`,
      { headers },
    );
    return response.data.Data;
  } catch (error) {
    if (error.status === 401) {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      accessToken1 = await getAccessToken1();
      headers.Authorization = `Bearer ${accessToken1}`;
    }

    try {
      const response = await axios.get(
        `https://api.qqcatalyst.com/v1/Policies/ByCustomer/${customerId}`,
        { headers },
      );
      return response.data.Data;
    } catch (error) {
      throw new Error("Failed to fetch from QQCatalyst after token refresh");
    }
  }
};

const qqCatalystRequestPolicies2 = async (customerId) => {
  if (!accessToken2) {
    accessToken2 = await getAccessToken2();
  }

  const headers = {
    Authorization: `Bearer ${accessToken2}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(
      `https://api.qqcatalyst.com/v1/Policies/ByCustomer/${customerId}`,
      { headers },
    );
    return response.data.Data;
  } catch (error) {
    if (error.status === 401) {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      accessToken2 = await getAccessToken2();
      headers.Authorization = `Bearer ${accessToken2}`;
    }

    try {
      const response = await axios.get(
        `https://api.qqcatalyst.com/v1/Policies/ByCustomer/${customerId}`,
        { headers },
      );
      return response.data.Data;
    } catch (error) {
      throw new Error("Failed to fetch from QQCatalyst after token refresh");
    }
  }
};

const qqCatalystRequestInfo1 = async (contactId) => {
  if (!accessToken1) {
    accessToken1 = await getAccessToken1();
  }

  const headers = {
    Authorization: `Bearer ${accessToken1}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(
      `https://api.qqcatalyst.com/v1/Contacts/${contactId}/AccountInfo`,
      { headers },
    );
    return response.data;
  } catch (error) {
    if (error.status === 401) {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      accessToken1 = await getAccessToken1();
      headers.Authorization = `Bearer ${accessToken1}`;
    }

    try {
      const response = await axios.get(
        `https://api.qqcatalyst.com/v1/Contacts/${contactId}/AccountInfo`,
        { headers },
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch from QQCatalyst after token refresh");
    }
  }
};

const qqCatalystRequestInfo2 = async (contactId) => {
  if (!accessToken2) {
    accessToken2 = await getAccessToken2();
  }

  const headers = {
    Authorization: `Bearer ${accessToken2}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(
      `https://api.qqcatalyst.com/v1/Contacts/${contactId}/AccountInfo`,
      { headers },
    );
    return response.data;
  } catch (error) {
    if (error.status === 401) {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      accessToken2 = await getAccessToken2();
      headers.Authorization = `Bearer ${accessToken2}`;
    }

    try {
      const response = await axios.get(
        `https://api.qqcatalyst.com/v1/Contacts/${contactId}/AccountInfo`,
        { headers },
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch from QQCatalyst after token refresh");
    }
  }
};

const qqCatalystRequestNotes1 = async (contactId) => {
  if (!accessToken1) {
    accessToken1 = await getAccessToken1();
  }

  const headers = {
    Authorization: `Bearer ${accessToken1}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(
      `https://api.qqcatalyst.com/v1/Contacts/${contactId}/Notes`,
      { headers },
    );
    return response.data.Data;
  } catch (error) {
    if (error.status === 401) {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      accessToken1 = await getAccessToken1();
      headers.Authorization = `Bearer ${accessToken1}`;
    }

    try {
      const response = await axios.get(
        `https://api.qqcatalyst.com/v1/Contacts/${contactId}/Notes`,
        { headers },
      );
      return response.data.Data;
    } catch (error) {
      throw new Error("Failed to fetch from QQCatalyst after token refresh");
    }
  }
};

const qqCatalystRequestNotes2 = async (contactId) => {
  if (!accessToken2) {
    accessToken2 = await getAccessToken2();
  }

  const headers = {
    Authorization: `Bearer ${accessToken2}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(
      `https://api.qqcatalyst.com/v1/Contacts/${contactId}/Notes`,
      { headers },
    );
    return response.data.Data;
  } catch (error) {
    if (error.status === 401) {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      accessToken2 = await getAccessToken2();
      headers.Authorization = `Bearer ${accessToken2}`;
    }

    try {
      const response = await axios.get(
        `https://api.qqcatalyst.com/v1/Contacts/${contactId}/Notes`,
        { headers },
      );
      return response.data.Data;
    } catch (error) {
      throw new Error("Failed to fetch from QQCatalyst after token refresh");
    }
  }
};

module.exports = {
  qqCatalystRequest1,
  qqCatalystRequest2,
  qqCatalystRequestPolicies1,
  qqCatalystRequestPolicies2,
  qqCatalystRequestInfo1,
  qqCatalystRequestInfo2,
  qqCatalystRequestNotes1,
  qqCatalystRequestNotes2,
};
