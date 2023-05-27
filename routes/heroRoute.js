const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/hero");
const { validateBody, isvalidId, handleUpload } = require("../middlewares");
const { addSchema } = require("../models/hero");

router.get("/heroes", ctrl.getAllHeroes);

router.get("/heroes/:id", isvalidId, ctrl.findHeroById);

router.post("/", validateBody(addSchema), handleUpload, ctrl.addHero);

router.patch(
  "/heroes/:id",
  isvalidId,
  validateBody(addSchema),
  handleUpload,
  ctrl.changeHero
);

router.delete("/heroes/:id", isvalidId, ctrl.deleteHero);

module.exports = router;
