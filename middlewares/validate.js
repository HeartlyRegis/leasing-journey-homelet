const { validationResult } = require('express-validator');


module.exports = (req, res, next) => {
    console.log('In Validation Middleware');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error(`Validation Error: ${JSON.stringify(errors)}`);
        return res.status(400).json({ error:errors });
    };
    next();
};