// const pool = require("../database");
const { queryDatabase } = require("../utils/utils");

function createMessageTable() {
  const query = `CREATE TABLE IF NOT EXISTS message(
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
                message varchar NOT NULL,
                time TIMESTAMP NOT NULL,
                group_id uuid references groups(id) DEFAULT NULL,
                sender_id uuid references users(id) NOT NULL,
                receiver_id uuid references users(id) DEFAULT NULL
                )`;
 return queryDatabase(query);
}

function addMessage(message, time, groupID, senderID) {
  const query = `INSERT INTO message (message, time, group_id,sender_id) values('${message}', '${time}', '${groupID}', '${senderID}')`;
 return queryDatabase(query);
}

module.exports = {
  createMessageTable,
  addMessage,
};
