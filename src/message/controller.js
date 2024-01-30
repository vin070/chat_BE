const { getAllGroupMemberList } = require("../group/database");
const { addMessage } = require("./database");
const { clients } = require("../connected_client");

async function sendMessage(data) {
  const { message, time, groupID, senderID } = data;
  await addMessage(message, time, groupID, senderID);

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
  //Send message to all group members
  groupMembersConn.forEach((memberSocketConn) => {
    memberSocketConn.send(JSON.stringify(data));
  });
}

module.exports = {
  sendMessage,
};
