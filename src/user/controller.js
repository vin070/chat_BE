const { removeSpecificUserConn } = require("../connected_client");
const { res_model } = require("../model/res.model");
const {
  createUserInDB,
  searchAllUsers,
  searchUserById,
  updateUserInDB,
  login,
} = require("./database");

async function createUser(req, res) {
  try {
    const { rows } = await createUserInDB(req.body);
    res.status(200).send(new res_model(rows[0], "user created successfully"));
  } catch (err) {
    res.status(500).send(new res_model(null, err.message));
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const keys = Object.keys(req.body);
    const updateTime = new Date().toISOString();

    let { rows } = await updateUserInDB(id, keys, req.body, updateTime);
    res.status(200).send(new res_model(rows[0], "user updated successfully"));
  } catch (err) {
    res.status(500).send(null, "failure while updating user");
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    let { rows } = await searchUserById(id);
    res.status(200).send(new res_model(rows[0], "Fetched all users list"));
  } catch (err) {
    res.status(500).send(new res_model(null, err.message));
  }
}

async function getAllUsers(req, res) {
  try {
    const { limit, offset } = req.query;
    let { rows } = await searchAllUsers(limit, offset);
    res.status(200).send(new res_model(rows, "Fetched all users list"));
  } catch (err) {
    res.status(500).send(new res_model(null, "failure"));
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    let { rows } = await login(username, password);
    if (rows.length) {
      res.status(200).send(new res_model(rows[0], "Successfully logged in"));
    } else {
      res.status(401).send(new res_model(null, "Invalid credential"));
    }
  } catch (e) {
    res.status(500).send(new res_model(e, "Error occured while login"));
  }
}

function logOut(req, res) {
  const { id } = req.body;
  removeSpecificUserConn(id);
  res.status(200).send(new res_model(null, "Successfully logged in"));
}

module.exports = {
  createUser,
  updateUser,
  getUserById,
  getAllUsers,
  loginUser,
  logOut,
};
