export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, _next) {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Something went wrong on our end.';
  let errors;

  if (err.name === 'CastError') {
    status = 400;
    message = `That ${err.path} does not look right.`;
  }
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Some fields need attention.';
    errors = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    status = 400;
    message = 'Each image must be under 5 MB.';
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    status = 400;
    message = 'Upload up to 6 images at a time, using the field name "images".';
  }
  if (err.code === 11000) {
    status = 409;
    message = `${Object.keys(err.keyValue).join(', ')} already exists.`;
  }

  res.status(status).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}
