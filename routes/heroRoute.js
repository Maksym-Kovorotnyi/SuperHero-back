const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/hero");
const { validateBody, isvalidId, handleUpload } = require("../middlewares");
const { addSchema } = require("../models/hero");

router.get("/", ctrl.getAllHeroes);

router.get("/:id", isvalidId, ctrl.findHeroById);

router.post("/", handleUpload, ctrl.createHero);

router.patch(
  "/:id",
  isvalidId,
  validateBody(addSchema),
  handleUpload,
  ctrl.changeHero
);

router.delete("/:id", isvalidId, ctrl.deleteHero);

module.exports = router;
