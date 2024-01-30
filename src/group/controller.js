const { createGroup, addMemberInGroup, getGroupList } = require("./database");
const { res_model } = require("../model/res.model");

async function addGroup(req, res) {
  const { name, userID } = req.body;
  try {
    const { rows } = await createGroup(userID, name);
    const groupID = rows[0].id;
    await addMemberInGroup(userID, groupID, userID, "ADMIN");
    res.status(200).send(new res_model(null, "Successfully created group"));
  } catch (err) {
    res
      .status(500)
      .send(new res_model(err.message, "failure in group creating"));
  }
}

async function addGroupMember(req, res) {
  const { groupID, userID, role } = req.body;
  try {
    await addMemberInGroup(userID, groupID, userID, role);
    res
      .status(200)
      .send(new res_model(null, "Successfully added member in group"));
  } catch (err) {
    res.status(500).send(new res_model(err, "Error adding member in group"));
  }
}

async function searchGroup(req, res) {
  const { limit, offset, query } = req.query;
  try {
    const { rows } = await getGroupList(limit, offset, query);
    res.status(200).send(new res_model(rows, rows?.length));
  } catch (err) {
    res.status(500).send(new res_model(err, "Failure in searching group"));
  }
}

module.exports = {
  addGroup,
  addGroupMember,
  searchGroup,
};
