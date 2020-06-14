const errorHandler = (err, req, res, next) => {
  res.status(400).json({ success: false });
};

module.exports = errorHandler;
