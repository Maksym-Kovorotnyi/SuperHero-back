const { Schema, model } = require("mongoose");
const Joi = require("joi");

// const handleMongooseError = require("../helpers/handleMongooseError");

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
    Images: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const addSchema = Joi.object({
  nickname: Joi.string().required(),
  real_name: Joi.string().required(),
  origin_description: Joi.string(),
  catch_phrase: Joi.string(),
});

// contactSchema.post("save", handleMongooseError);

const Hero = model("heroCard", heroSchema);

module.exports = { Hero, addSchema };
