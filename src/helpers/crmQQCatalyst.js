const {
  qqCatalystRequestSearch,
  qqCatalystRequestNotes,
  qqCatalystInsertContact,
  qqCatalystInsertNotes,
  qqCatalystGetRequest,
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
      return qqCatalystInsertContact(contactPayload, 89);
    } else if (officeId === 1) {
      return qqCatalystInsertContact(contactPayload, 117);
    }

    return { EntityID: 0, ErrorMessage: "office ID not found." };
  }

  return { EntityID: contactExistsId, ErrorMessage: "Contact already exists." };
};

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

const formatName = (name) => name?.trim() || ".";
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
    office
  );
  return Phone;
};

const getPhoneList = async () => {
  const offices = [89, 117];
  const phoneList = [];
  for (const office of offices) {
    const policies = await getPolicies(office);
    for (const policy of policies) {
      if (policy.Status === "A") {
        const phone = await getContactPhone(policy.CustomerId, office);
        if (phone) {
          phoneList.push(phone);
        }
      }
    }
  }
  return phoneList;
};

module.exports = {
  insertContact,
  getNotes,
  insertNotes,
  getPhoneList,
};
