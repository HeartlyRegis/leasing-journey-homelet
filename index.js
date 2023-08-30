require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//=== 1 - CREATE APP
// Creating express app and configuring middleware needed for authentication
const app = express();
app.use(bodyParser.json({ limit: '5mb' }))
app.use(cookieParser());
require('./startup/routes')(app);


//=== 5 - START SERVER
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log('Server running on http://localhost:'+PORT+'/'));

module.exports = server;