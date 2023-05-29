const ctrlWrapper = (ctrl) => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({ error: errors });
      }
      next(error);
    }
  };
  return func;
};

module.exports = { ctrlWrapper };
