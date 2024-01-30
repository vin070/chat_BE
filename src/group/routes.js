const express = require("express");
const router = express.Router();

const { addGroup, addGroupMember,searchGroup } = require("./controller");

router.post("/create", addGroup);
router.post("/add_member", addGroupMember);
router.get("/search", searchGroup);

module.exports = router;