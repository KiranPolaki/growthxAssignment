const asyncHandler = () => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next());
  };
};

export { asyncHandler };
