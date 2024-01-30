const pool = require("../database");
const { queryDatabase } = require("../utils/utils");

//Create chat group table
function createGroupTable() {
  const query = `CREATE TABLE IF NOT EXISTS groups(
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          created_by uuid NOT NULL references users(id),
          name VARCHAR NOT NULL,
          created_at timestamp DEFAULT current_timestamp
          )`;
 return queryDatabase(query);
}

//create member table
function createMemberTable() {
  const query = `CREATE TABLE IF NOT EXISTS members(
    group_id uuid references groups(id) DEFAULT NULL,
    member_id uuid NOT NULL references users(id),
    added_by uuid references users(id) DEFAULT NULL, 
    role varchar DEFAULT NULL,
    opponent_id uuid references users(id) DEFAULT NULL
    )`;
 return queryDatabase(query);
}

//Create group for chat
function createGroup(createdBy, name) {
  const query = `INSERT INTO groups(created_by, name) VALUES('${createdBy}', '${name}') RETURNING id`;
 return queryDatabase(query);
}

//Add member in group
function addMemberInGroup(memberID, groupID, addedBy, role, opponentID) {
  let query = `INSERT INTO members (group_id, member_id, added_by, role) values('${groupID}', '${memberID}', '${addedBy}', '${role}')`;
  if (!groupID) {
    query = `INSERT INTO members (member_id,opponent_id) values('${memberID}', '${opponentID}')`;
  }
 return queryDatabase(query);
}

function getGroupList(limit, offset, searchQuery) {
  const query = `SELECT * from groups 
                 WHERE name ILIKE '%${searchQuery}%'
                 ORDER BY name
                 LIMIT ${limit} OFFSET ${offset}
                `;
  return queryDatabase(query);
}

//Get group member list
function getAllGroupMemberList(groupID) {
  const query = `select * from members where group_id='${groupID}'`;
  return queryDatabase(query);
}

module.exports = {
  createGroup,
  createGroupTable,
  createMemberTable,
  addMemberInGroup,
  getGroupList,
  getAllGroupMemberList,
};
