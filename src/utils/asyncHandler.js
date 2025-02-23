const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err)); // ✅ Properly closes .catch()
    };
};

export { asyncHandler }; // ✅ Ensure export statement is present
