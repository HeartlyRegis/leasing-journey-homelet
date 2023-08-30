const express = require('express');
const cors = require('cors');
const path = require("path");

module.exports = function (app) {
    app.use(cors());
  
    // for parsing application/json
    app.use(express.json());
  
    // for parsing application/xwww-
    app.use(express.urlencoded({ extended: false }));
    //form-urlencoded
  
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
  
    //=== 3 - CONFIGURE ROUTES
    //Configure Route
    require('../routes/index')(app);
    app.use((error, req, res, next) => {
        console.error('in Error middleware', error)
        return res.status(400).send(error);
      });
  }