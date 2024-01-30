const { queryDatabase } = require("../utils/utils");

function createReactionTable() {
  const query = `CREATE TABLE IF NOT EXISTS reaction(
                 message_id uuid NOT NULL references message(id),
                 reaction varchar NOT NULL,
                 member_id uuid references users(id)
                )`;
 return queryDatabase(query);
}

function addReaction(messageID, reaction, memberID) {
  const query = `INSERT INTO reaction (message_id, reaction, member_id) values('${messageID}', '${reaction}', '${memberID}')`;
 return queryDatabase(query);
}

module.exports = {
  createReactionTable,
  addReaction,
};
