
const express = require("express");
const { handlegenerateNewshorturl, handlegetanylatics } = require('../controllers/url');
const router = express.Router();

router.post("/", handlegenerateNewshorturl);
router.get("/analytics/:shortId", handlegetanylatics);
module.exports = router;