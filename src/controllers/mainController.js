const {
  qqCatalystRequest1,
  qqCatalystRequest2,
  qqCatalystRequestPolicies1,
  qqCatalystRequestPolicies2,
  qqCatalystRequestInfo1,
  qqCatalystRequestInfo2,
  qqCatalystRequestNotes1,
  qqCatalystRequestNotes2,
} = require("../helpers/qqcatalyst");

const search = async (req, res) => {
  try {
    const [sebanda89, sebanda117] = await Promise.all([
      qqCatalystRequest1(req.body.criteria),
      qqCatalystRequest2(req.body.criteria),
    ]);
    res.status(200).json({ sebanda89, sebanda117 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const policies = async (req, res) => {
  let policies;
  try {
    if (req.body.location === 89) {
      policies = await qqCatalystRequestPolicies1(req.body.customerId);
    }
    if (req.body.location === 117) {
      policies = await qqCatalystRequestPolicies2(req.body.customerId);
    }
    res.status(200).json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const info = async (req, res) => {
  let info;
  try {
    if (req.body.location === 89) {
      info = await qqCatalystRequestInfo1(req.body.customerId);
    }
    if (req.body.location === 117) {
      info = await qqCatalystRequestInfo2(req.body.customerId);
    }
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const notes = async (req, res) => {
  let notes;
  try {
    if (req.body.location === 89) {
      notes = await qqCatalystRequestNotes1(req.body.customerId);
    }
    if (req.body.location === 117) {
      notes = await qqCatalystRequestNotes2(req.body.customerId);
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
