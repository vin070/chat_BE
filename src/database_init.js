const { createMemberTable, createGroupTable } = require("./group/database");
const { createUserTable } = require("./user/database");
const { createMessageTable } = require('./message/database');
const { createReactionTable } = require("./reaction/database");
const { queryDatabase } = require("./utils/utils");

async function init_database() {
  await queryDatabase('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await createUserTable();
  await createGroupTable();
  await createMemberTable();
  await createMessageTable(); 
  await createReactionTable();
}

module.exports = init_database;
