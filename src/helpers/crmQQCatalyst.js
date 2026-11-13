const axios = require("axios");
const { getAccessToken1, getAccessToken2 } = require("./accessToken");
const {
  qqCatalystRequest1,
  qqCatalystRequest2,
  qqCatalystRequestNotes1,
  qqCatalystRequestNotes2,
} = require("./qqcatalyst");
let accessToken1;
let accessToken2;
const user1 = process.env.QQ89_USER;
const password1 = process.env.QQ89_PASSWORD;
const user2 = process.env.QQ117_USER;
const password2 = process.env.QQ117_PASSWORD;
const agents = [
  ["Valery Romero", 37419, 18437],
  ["Sebastian Delgadillo", 37520, 18437],
  ["Antonio Munoz", 40624, 18437],
  ["Gabriela Vazquez", 35841, 18437],
  ["Sonia Bobadilla", 19367, 18437],
  ["Lisbeth Lasso", 7805, 1],
  ["Vanessa Arevalo", 9608, 1],
  ["Victoria Thomas", 40772, 18437],
  ["Jeimy Jimenez", 35860, 18437],
  ["Isabella Pombo", 36183, 18437],
  ["Steven Franco", 24413, 18437],
  ["Valeria Medina", 30032, 18437],
  ["Camila Burbano", 37306, 18437],
  ["Paula Castaneda", 38084, 18437],
  ["Laura Yaya", 41121, 18437],
  ["Monica Barrero", 41457, 18437],
  ["Darelis Fernandez", 2, 1],
  ["Johana Pulido", 9984, 1],
];

const insertContact = async (contactData) => {
  const cleanPhoneNumber = contactData.Phone.replace(/\D/g, "");
  const contactExistsId = await search(cleanPhoneNumber);

  if (contactExistsId === 0) {
    const { agentId, officeId } = getAgentId(contactData.AgentName);
    const contactPayload = {
      FirstName: formatName(contactData.FirstName),
      LastName: formatName(contactData.LastName),
      Email: contactData.Email,
      Phone: cleanPhoneNumber,
      AgentId: agentId,
      LocationID: officeId,
      ContactSubType: "P",
      ContactType: "P",
      Status: "A",
    };

    if (officeId === 18437) {
      return qqCatalystInsertContact1(contactPayload);
    } else if (officeId === 1) {
      return qqCatalystInsertContact2(contactPayload);
    }

    return { EntityID: 0, ErrorMessage: "office ID not found." };
  }

  return { EntityID: contactExistsId, ErrorMessage: "Contact already exists." };
};

const getNotes = async (contactData) => {
  const contact = await getContactIdForNotes(contactData);
  if (contact.EntityId !== 0 && contact.Office === 89) {
    return qqCatalystRequestNotes1(contact.EntityId);
  }
  if (contact.EntityId !== 0 && contact.Office === 117) {
    return qqCatalystRequestNotes2(contact.EntityId);
  }
  return [];
};

const insertNotes = async (noteData) => {
  const contact = await getContactIdForNotes(noteData);
  const notePayload = {
    AssignedContactId: contact.EntityId,
    Comment: formatText(noteData.Comment),
    CreatedBy: noteData.CreatedBy || "Trust CRM",
  };
  if (contact.EntityId !== 0 && contact.Office === 89) {
    return qqCatalystInsertNotes1(notePayload);
  }
  if (contact.EntityId !== 0 && contact.Office === 117) {
    return qqCatalystInsertNotes2(notePayload);
  }
  return {
    Result: false,
    ErrorMessage: "Contact not found for inserting notes.",
  };
};

const getContactIdForNotes = async (contactData) => {
  const contactId = contactData.QQID;
  const phoneNumber = contactData.Phone.replace(/\D/g, "");
  const [contact89, contact117] = await Promise.all([
    qqCatalystRequest1(phoneNumber),
    qqCatalystRequest2(phoneNumber),
  ]);

  if (contact89.length > 0) {
    const { EntityId } = contact89.find(
      ({ EntityId }) => EntityId === contactId,
    ) || { EntityId: contact89[0].EntityId };
    return { EntityId, Office: 89 };
  }

  if (contact117.length > 0) {
    const { EntityId } = contact117.find(
      ({ EntityId }) => EntityId === contactId,
    ) || { EntityId: contact117[0].EntityId };
    return { EntityId, Office: 117 };
  }

  return { EntityId: 0, Office: null };
};

const search = async (phoneNumber) => {
  const [sebanda89, sebanda117] = await Promise.all([
    qqCatalystRequest1(phoneNumber),
    qqCatalystRequest2(phoneNumber),
  ]);

  if (sebanda89.length > 0) {
    return sebanda89[0].EntityId;
  }

  if (sebanda117.length > 0) {
    return sebanda117[0].EntityId;
  }

  return 0;
};

const getAgentId = (agentName) => {
  const agent = agents.find(([name]) => name === agentName);
  return agent
    ? { agentId: agent[1], officeId: agent[2] }
    : { agentId: 2, officeId: 1 };
};

const formatName = (name) => name?.trim() || ".";
const formatText = (note) => {
  if (!note || note.trim() === "") {
    return ".";
  }
  return note
    .replace(/\r\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
};

const qqCatalystInsertContact1 = async (contactPayload) => {
  if (!accessToken1) {
    accessToken1 = await getAccessToken1(user1, password1);
  }
  const headers = {
    Authorization: `Bearer ${accessToken1}`,
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
      accessToken1 = await getAccessToken1(user1, password1);
      headers.Authorization = `Bearer ${accessToken1}`;
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

const qqCatalystInsertContact2 = async (contactPayload) => {
  if (!accessToken2) {
    accessToken2 = await getAccessToken2(user2, password2);
  }
  const headers = {
    Authorization: `Bearer ${accessToken2}`,
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
      accessToken2 = await getAccessToken2(user2, password2);
      headers.Authorization = `Bearer ${accessToken2}`;
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

const qqCatalystInsertNotes1 = async (notePayload) => {
  if (!accessToken1) {
    accessToken1 = await getAccessToken1(user1, password1);
  }
  const headers = {
    Authorization: `Bearer ${accessToken1}`,
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
      accessToken1 = await getAccessToken1(user1, password1);
      headers.Authorization = `Bearer ${accessToken1}`;
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

const qqCatalystInsertNotes2 = async (notePayload) => {
  if (!accessToken2) {
    accessToken2 = await getAccessToken2(user2, password2);
  }
  const headers = {
    Authorization: `Bearer ${accessToken2}`,
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
      accessToken2 = await getAccessToken2(user2, password2);
      headers.Authorization = `Bearer ${accessToken2}`;
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

module.exports = {
  insertContact,
  getNotes,
  insertNotes,
};
