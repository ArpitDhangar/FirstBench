class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "Development") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default ErrorHandler;
