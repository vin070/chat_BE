const {
  createGroup,
  addMemberInGroup,
  getGroupList,
  getGroupMemberDetails,
} = require("./database");
const { res_model } = require("../model/res.model");

async function addGroup(req, res) {
  const { name, userID, membersID } = req.body;
  try {
    const { rows } = await createGroup(userID, name);
    const groupID = rows[0].id;
    for (let memberID of membersID || [userID]) {
      await addMemberInGroup(
        memberID,
        groupID,
        userID,
        memberID === userID ? "ADMIN" : null
      );
    }
    res.status(200).send(new res_model(groupID, "Successfully created group"));
  } catch (err) {
    res
      .status(500)
      .send(new res_model(err.message, "failure in group creating"));
  }
}

async function addGroupMember(req, res, done) {
  const { memberID, groupID, userID, role } = req.body;
  //is member already exist
  try {
    const { rows } = await getGroupMemberDetails(groupID, memberID);
    if (rows.length) {
      res
        .status(500)
        .send(new res_model(null, "Member already exist in group"));
     return done();
    }
  } catch (e) {
    res
      .status(500)
      .send(new res_model(e, "Error checking group member existence"));
   return done();
  }

  //User who is adding in group should be member of group irrespective of role
  try {
    const { rows } = await getGroupMemberDetails(groupID, userID);
    if (!rows.length) {
      res
        .status(500)
        .send(new res_model(null, "You are not allowed to add in group"));
     return done();
    }
  } catch (e) {
    res
      .status(500)
      .send(new res_model(e, "Error checking group member existence"));
   return done();
  }

  try {
    await addMemberInGroup(memberID, groupID, userID, role);
    res
      .status(200)
      .send(new res_model(null, "Successfully added member in group"));
   return done();
  } catch (err) {
    res.status(500).send(new res_model(err, "Error adding member in group"));
   return done();
  }
}

async function searchGroup(req, res) {
  const { limit, offset, query } = req.query;
  try {
    const { rows } = await getGroupList(limit, offset, query);
    res
      .status(200)
      .send(new res_model(rows, "Successfully fetched group list"));
  } catch (err) {
    res.status(500).send(new res_model(null, "Failure in searching group"));
  }
}

module.exports = {
  addGroup,
  addGroupMember,
  searchGroup,
};
