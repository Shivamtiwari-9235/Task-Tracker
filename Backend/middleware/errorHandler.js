function notFound(req, res) {
  return res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

function errorHandler(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;

  if (statusCode === 500) {
    console.error(err);
  }

  return res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
}

module.exports = { notFound, errorHandler };

