const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/hero");
const { validateBody, isvalidId } = require("../middlewares");
const { addSchema } = require("../models/hero");

router.get("/", ctrl.getAllHeroes);

router.get("/:id", isvalidId, ctrl.findHeroById);

router.post("/", validateBody(addSchema), ctrl.addHero);

router.patch("/:id", isvalidId, ctrl.changeHero);

router.delete("/:id", isvalidId, ctrl.deleteHero);

module.exports = router;
