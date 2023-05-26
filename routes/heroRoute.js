const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/hero");

router.get("/", ctrl.getAllHeroes);

module.exports = router;
