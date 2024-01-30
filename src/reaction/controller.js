const { getAllGroupMemberList } = require("../group/database");
const { addReaction } = require("./database");
const { clients } = require("../connected_client");

async function messageReaction(data) {
  const { messageID, reaction, memberID,groupID } = data;
  await addReaction(messageID, reaction, memberID);
  
  //Find all users in specific group using group ID
  const { rows } = await getAllGroupMemberList(groupID);
  const groupMembersConn = [];
  for (let { member_id } of rows) {
    if (clients[member_id]) {
      clients[member_id].forEach((memberSocketConn) => {
        groupMembersConn.push(memberSocketConn);
      });
    }
  }

  //Send reaction to all group members
  groupMembersConn.forEach((memberSocketConn) => {
    memberSocketConn.send(JSON.stringify(data));
  });
}

module.exports = {
  messageReaction,
};
