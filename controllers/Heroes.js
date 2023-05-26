const { Hero } = require("../models/hero");
const { HttpError } = require("../helpers");
const { ctrlWrapper } = require("../helpers");

const getAllHeroes = async (req, res) => {
  const result = await Hero.find();

  res.json(result);
};

module.exports = {
  getAllHeroes: ctrlWrapper(getAllHeroes),
};
