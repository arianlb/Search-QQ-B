const {
  qqCatalystRequestSearch,
  qqCatalystRequestPolicies,
  qqCatalystRequestInfo,
  qqCatalystRequestNotes,
} = require("../helpers/qqcatalyst");

const search = async (req, res) => {
  try {
    const [sebanda89, sebanda117] = await Promise.all([
      qqCatalystRequestSearch(req.body.criteria, 89),
      qqCatalystRequestSearch(req.body.criteria, 117),
    ]);
    res.status(200).json({ sebanda89, sebanda117 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const policies = async (req, res) => {
  let policies;
  try {
    if (req.body.location === 89 || req.body.location === 117) {
      policies = await qqCatalystRequestPolicies(req.body.customerId, req.body.location);
    }
    res.status(200).json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const info = async (req, res) => {
  let info;
  try {
    if (req.body.location === 89 || req.body.location === 117) {
      info = await qqCatalystRequestInfo(req.body.customerId, req.body.location);
    }
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const notes = async (req, res) => {
  let notes;
  try {
    if (req.body.location === 89 || req.body.location === 117) {
      notes = await qqCatalystRequestNotes(req.body.customerId, req.body.location);
    }
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  search,
  policies,
  info,
  notes,
};
