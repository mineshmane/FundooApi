var express = require('express');
require('dotenv').config()
var bodyParser = require('body-parser');
var config = require('./config/config')
var app = express();
var route = require('./Routers/Router');
var expressValidator = require('express-validator');
const mongoose = require('mongoose');
app.use(bodyParser.json())
app.use(expressValidator())
app.use('/', route);
port = process.env.port


mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true,
    useFindAndModify: false, useCreateIndex: true
}, (err, data) => {
    if (err) {
        console.log('error in database connection');

    } else {
        console.log('Database connected successFully');
     

    }
})
app.listen(port, (err, data) => {
    if (err) {
        console.log(" error in listening ", err);

    } else {
        console.log('server connected successfully');
        console.log('listening on port 3000');
    }
})