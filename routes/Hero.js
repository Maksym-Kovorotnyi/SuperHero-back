const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/heroes");

router.get("/", ctrl.getAllHeroes);

module.exports = router;
