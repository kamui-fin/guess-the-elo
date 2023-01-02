export const errorHandler = (err, req, res, next) => {
    const { statusCode = 500, message } = err
    res.status(statusCode).send({
        status: statusCode,
        message,
    })
}
