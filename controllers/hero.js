const { Hero } = require("../models/hero");
const { HttpError } = require("../helpers");
const { ctrlWrapper } = require("../helpers");

const getAllHeroes = async (req, res) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;
  const resultAll = await Hero.find();
  const result = await Hero.find().skip(skip).limit(limit);

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ heroes: result, total: resultAll.length });
};

const findHeroById = async (req, res) => {
  const { id } = req.params;
  const result = await Hero.findById(id);
  if (!result) {
    throw HttpError(404, "There is no such Id");
  }
  res.json(result);
};

const createHero = async (req, res) => {
  const result = await Hero.create({ ...req.body, images: req.file.path });
  res.status(201).json(result);
};

const changeHero = async (req, res) => {
  const { id } = req.params;
  if (req.file?.path) {
    const result = await Hero.findByIdAndUpdate(
      id,
      { ...req.body, images: req.file.path },
      { new: true }
    );
    if (!result) {
      throw HttpError(404, "There is no such Id");
    }
    res.json(result);
  } else {
    const result = await Hero.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
      throw HttpError(404, "There is no such Id");
    }
    res.json(result);
  }
};

const deleteHero = async (req, res) => {
  const { id } = req.params;
  const result = await Hero.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, "There is no such Id");
  }
  res.json({ message: "Deleted" });
};

module.exports = {
  getAllHeroes: ctrlWrapper(getAllHeroes),
  createHero: ctrlWrapper(createHero),
  changeHero: ctrlWrapper(changeHero),
  deleteHero: ctrlWrapper(deleteHero),
  findHeroById: ctrlWrapper(findHeroById),
};
