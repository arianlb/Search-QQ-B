const { insertContact } = require("../helpers/crmQQCatalyst");

const insert = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader !== `Bearer ${process.env.GHL_WEBHOOK_SECRET}`) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    await insertContact(req.body);
    res.status(200).json({ message: "Operation executed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  insert,
};
