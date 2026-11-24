const {
  qqCatalystRequestSearch,
  qqCatalystRequestNotes,
  qqCatalystInsertContact,
  qqCatalystInsertNotes,
  qqCatalystGetRequest,
  qqCatalystSetSource,
} = require("./qqcatalyst");

const agents = [
  ["Valery Romero", 37419, 18437],
  ["Ingrid Cely", 42436, 18437],
  ["Antonio Munoz", 40624, 18437],
  ["Gabriela Vazquez", 35841, 18437],
  ["Sonia Bobadilla", 19367, 18437],
  ["Lisbeth Lasso", 7805, 1],
  ["Vanessa Arevalo", 9608, 1],
  ["Victoria Thomas", 40772, 18437],
  ["Alicia Avedano", 35860, 18437],
  ["Isabella Pombo", 36183, 18437],
  ["Steven Franco", 24413, 18437],
  ["Valeria Medina", 30032, 18437],
  ["Camila Burbano", 37306, 18437],
  ["Paula Castaneda", 38084, 18437],
  ["Laura Yaya", 41121, 18437],
  ["Monica Barrero", 41457, 18437],
  ["Darelis Fernandez", 2, 1],
  ["Ayme Mena", 10183, 1],
  ["Marco Romero", 10224, 1],
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
      const result = await qqCatalystInsertContact(contactPayload, 89);
      if (result) {
        await setSource(contactData.Source, contactData.Marketing, 89, result.EntityID);
      }
      return result;
    } else if (officeId === 1) {
      const result = await qqCatalystInsertContact(contactPayload, 117);
      if (result) {
        await setSource(contactData.Source, contactData.Marketing, 117, result.EntityID);
      }
      return result;
    }

    return { EntityID: 0, ErrorMessage: "office ID not found." };
  }

  return { EntityID: contactExistsId, ErrorMessage: "Contact already exists." };
};

// Este codigo hay que arreglarlo!!!
const setSource = async (source, marketing, office, contactId) => {
  
  if (marketing === "S") {
    const sourceMapping = [
      ['email', 49, 19],
      ['whatsapp', 65, 32],
      ['call', 62, 31],
    ];
    
    const sourceEntry = sourceMapping.find(([src]) => src === source) || ['referral', 55, 25];  
    return qqCatalystSetSource(contactId, office === 89 ? sourceEntry[1] : sourceEntry[2], office);
  }

  if (source === "email") {
    return qqCatalystSetSource(contactId, office === 89 ? 49 : 19, office);
  } else {
    return qqCatalystSetSource(contactId, office === 89 ? 84 : 35, office);
  }
}

const getNotes = async (contactData) => {
  const contact = await getContactIdForNotes(contactData);
  if (
    contact.EntityId !== 0 &&
    (contact.Office === 89 || contact.Office === 117)
  ) {
    const notes = await qqCatalystRequestNotes(
      contact.EntityId,
      contact.Office,
    );
    return formatNotes(notes);
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
  if (
    contact.EntityId !== 0 &&
    (contact.Office === 89 || contact.Office === 117)
  ) {
    return qqCatalystInsertNotes(notePayload, contact.Office);
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
    qqCatalystRequestSearch(phoneNumber, 89),
    qqCatalystRequestSearch(phoneNumber, 117),
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
    qqCatalystRequestSearch(phoneNumber, 89),
    qqCatalystRequestSearch(phoneNumber, 117),
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

const formatName = (name) => name?.trim() || "Unknown";
const formatText = (note) => {
  if (!note || note.trim() === "") {
    return ".";
  }

  return note.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t");
};

const formatNotes = (notes) => {
  if (!notes || notes.length === 0) {
    return [];
  }

  return notes.map((note) => ({
    noteBody: `${note.Comment}\nCreated By: ${note.CreatedBy}\nCreated Date: ${note.CreatedOn.substring(0, 10)}`,
  }));
};

const getPolicies = async (office) => {
  const { Data, TotalItems } = await qqCatalystGetRequest(
    "https://api.qqcatalyst.com/v1/Policies/LastModifiedCreated?pageSize=100&pageNumber=1",
    office,
  );
  if (TotalItems > 100) {
    const totalPages = Math.ceil(TotalItems / 100);
    for (let page = 2; page <= totalPages; page++) {
      const pageData = await qqCatalystGetRequest(
        `https://api.qqcatalyst.com/v1/Policies/LastModifiedCreated?pageSize=100&pageNumber=${page}`,
        office,
      );
      Data.push(...pageData.Data);
    }
  }
  return Data;
};

const getContactPhone = async (contactId, office) => {
  const { Phone } = await qqCatalystGetRequest(
    `https://api.qqcatalyst.com/v1/Contacts/${contactId}/ContactSummaryDTO`,
    office,
  );
  return Phone;
};

const getPhoneListByOffice = async (office) => {
  const policies = await getPolicies(office);
  const phoneList = [];
  for (const policy of policies) {
    if (policy.Status === "A" && policy.CreatedOn.substring(0, 10) === policy.DateLastModified.substring(0, 10)) {
      const phone = await getContactPhone(policy.CustomerId, office);
      if (phone) {
        phoneList.push(phone.length > 10 ? "+" + phone : phone);
      }
    }
  }
  return phoneList;
};

const getPhoneList = async () => {
  const [phoneList89, phoneList117] = await Promise.all([
    getPhoneListByOffice(89),
    getPhoneListByOffice(117),
  ]);
  return [...phoneList89, ...phoneList117];
};

module.exports = {
  insertContact,
  getNotes,
  insertNotes,
  getPhoneList,
};
