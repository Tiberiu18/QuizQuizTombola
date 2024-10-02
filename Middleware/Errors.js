const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // this will be handled by errorHandler - pass the error to the next middleware in the stack
}


const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    // console.log(err);
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
    // stack => if we are in production mode, we don't want to show the stack trace
}

export {    notFound,    errorHandler};