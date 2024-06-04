const express = require("express");
const router = express.Router();
const { handleusersingnup, handleuserlogin } = require("../controllers/user");

router.post("/", handleusersingnup);
router.post("/login", handleuserlogin);

module.exports = router;