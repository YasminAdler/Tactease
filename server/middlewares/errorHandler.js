exports.errorHandler = (error, req, res, next) => {
  if(error.code === 11000) {
    return res.status(409).json({ message: 'Duplicate key error: ' + error.keyValue });
  }
  res.status(error.status || 500);
  res.json({ message: error.message || 'Internal Server Error' });
};
