const axios = require("axios");
const { getAccessToken } = require("./accessToken");
let accessToken89;
let accessToken117;

const qqCatalystRequestSearch = async (criteria, office) => {
  let token = await getToken(office, false);
  const locationID = office === 89 ? 18437 : 1;

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(
      `https://api.qqcatalyst.com/v1/Search?searchString=${criteria}&locationID=${locationID}`,
      { headers },
    );
    return response.data.Contacts;
  } catch (error) {
    if (error.status === 401) {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      token = await getToken(office, true);
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await axios.get(
        `https://api.qqcatalyst.com/v1/Search?searchString=${criteria}&locationID=${locationID}`,
        { headers },
      );
      return response.data.Contacts;
    } catch (error) {
      throw new Error("Failed to fetch from QQCatalyst after token refresh");
    }
  }
};

const qqCatalystRequestPolicies = async (customerId, office) => {
  let token = await getToken(office, false);

  const headers = {
    Authorization: `Bearer ${token}`,
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
      token = await getToken(office, true);
      headers.Authorization = `Bearer ${token}`;
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

const qqCatalystRequestInfo = async (contactId, office) => {
  let token = await getToken(office, false);

  const headers = {
    Authorization: `Bearer ${token}`,
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
      token = await getToken(office, true);
      headers.Authorization = `Bearer ${token}`;
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

const qqCatalystRequestNotes = async (contactId, office) => {
  let token = await getToken(office, false);

  const headers = {
    Authorization: `Bearer ${token}`,
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
      token = await getToken(office, true);
      headers.Authorization = `Bearer ${token}`;
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

const qqCatalystInsertContact = async (contactPayload, office) => {
  let token = await getToken(office, false);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.put(
      "https://api.qqcatalyst.com/v1/Contacts",
      contactPayload,
      {
        headers,
      },
    );
    return response.data;
  } catch (error) {
    if (error.status === 401) {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      token = await getToken(office, true);
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await axios.put(
        "https://api.qqcatalyst.com/v1/Contacts",
        contactPayload,
        {
          headers,
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(
        "Failed to insert contact from QQCatalyst after token refresh",
      );
    }
  }
};

const qqCatalystInsertNotes = async (notePayload, office) => {
  let token = await getToken(office, false);
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.put(
      `https://api.qqcatalyst.com/v1/Contacts/Notes`,
      notePayload,
      {
        headers,
      },
    );
    return response.data.Result;
  } catch (error) {
    if (error.status === 401) {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      token = await getToken(office, true);
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await axios.put(
        `https://api.qqcatalyst.com/v1/Contacts/Notes`,
        notePayload,
        {
          headers,
        },
      );
      return response.data.Result;
    } catch (error) {
      throw new Error("Failed to insert notes from QQCatalyst");
    }
  }
};

const qqCatalystGetRequest = async (url, office) => {
  let token = await getToken(office, false);
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(
      url,
      {
        headers,
      },
    );
    return response.data;
  } catch (error) {
    if (error.status === 401) {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      token = await getToken(office, true);
      headers.Authorization = `Bearer ${token}`;
    }
    
    try {
      const response = await axios.get(
        url,
        {
          headers,
        },
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to get request from QQCatalyst");
    }
  }
};

const qqCatalystSetSource = async (contactId, sourceId, office) => {
  let token = await getToken(office, false);
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.put(
      `https://api.qqcatalyst.com/v1/Customers/${contactId}/UpdateCustomerSource/${sourceId}`,
      {
        headers,
      },
    );
    return response.data;
  } catch (error) {
    if (error.status === 401) {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      token = await getToken(office, true);
      headers.Authorization = `Bearer ${token}`;
    }
    
    try {
      const response = await axios.put(
        `https://api.qqcatalyst.com/v1/Customers/${contactId}/UpdateCustomerSource/${sourceId}`,
        {
          headers,
        },
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to set source from QQCatalyst");
    }
  }
};

const getToken = async (office, update) => {
  if (office === 89) {
    if (!accessToken89 || update) {
      accessToken89 = await getAccessToken(89);
    }
    return accessToken89;
  }
  if (office === 117) {
    if (!accessToken117 || update) {
      accessToken117 = await getAccessToken(117);
    }
    return accessToken117;
  }
};

module.exports = {
  qqCatalystRequestSearch,
  qqCatalystRequestPolicies,
  qqCatalystRequestInfo,
  qqCatalystRequestNotes,
  qqCatalystInsertContact,
  qqCatalystInsertNotes,
  qqCatalystGetRequest,
  qqCatalystSetSource,
};
