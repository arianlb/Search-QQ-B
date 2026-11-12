const { insertContact, getNotes, insertNotes } = require("../helpers/crmQQCatalyst");

const insert = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader !== `Bearer ${process.env.GHL_WEBHOOK_SECRET}`) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    const result = await insertContact(req.body);

    if (result && result.EntityID === 0) {
      return res.status(400).json({ message: result.ErrorMessage });
    }
    res.status(200).json({ qqId: result.EntityID });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNotesController = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader !== `Bearer ${process.env.GHL_WEBHOOK_SECRET}`) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    const result = await getNotes(req.body);
    res.status(200).json({ notes: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const insertNotesController = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader !== `Bearer ${process.env.GHL_WEBHOOK_SECRET}`) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    const result = await insertNotes(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  insert,
  getNotesController,
  insertNotesController
};
