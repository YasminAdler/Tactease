const errorHandler = (error, req, res, next) => {
    res.status(error.status || 500);
    return res.json({ message: error.message || "Internal Server Error" });
};

module.exports = errorHandler;