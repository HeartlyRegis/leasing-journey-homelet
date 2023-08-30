const homelet = require('./homelet')
module.exports = (app) => {
    app.get('/', (req, res) => {
        res.status(200).send({ success: true });
    });
    app.use('/auth', homelet);
};