const express = require("express");
const router = express.Router();
const {
  createUser,
  updateUser,
  getUserById,
  getAllUsers,
  loginUser,
  logOut,
} = require("./controller");

router.post("/create", createUser);
router.post("/login", loginUser);
router.patch("/:id", updateUser);
router.get("/list", getAllUsers);
router.get("/:id", getUserById);
router.post("/logout", logOut);

module.exports = router;
