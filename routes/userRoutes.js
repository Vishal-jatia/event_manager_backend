const express = require("express");
const router = express.Router();

const { updateUser } = require("../controllers/userController.js");

router.route("/update").post(updateUser);
module.exports = router;