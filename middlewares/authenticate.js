exports.is_auth = (req, res, next) => {
    const token = req.header('x-api-key');
    if (token != process.env.X_API_KEY) {
        console.error('Invalid X Api Key');
        return res.status(400).send({ error: 'HOMELET_INTERNAL_SERVICE_ACCESS_DENIED' });
    }
    next();
};