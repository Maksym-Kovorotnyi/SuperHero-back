const { Schema, model } = require("mongoose");
const Joi = require("joi");

const heroSchema = new Schema(
  {
    nickname: {
      type: String,
      required: true,
    },
    real_name: {
      type: String,
      required: true,
    },
    origin_description: {
      type: String,
    },
    catch_phrase: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const addSchema = Joi.object({
  nickname: Joi.string(),
  real_name: Joi.string(),
  origin_description: Joi.string(),
  catch_phrase: Joi.string(),
});

const Hero = model("card", heroSchema);

module.exports = { Hero, addSchema };
