var express = require('express');
require('dotenv').config()
var bodyParser = require('body-parser');
var config = require('./config/config')
var cors = require('cors');

const multer = require('multer');
var app = express();
app.use(cors());
var route = require('./Routers/Router');
var expressValidator = require('express-validator');
const mongoose = require('mongoose');

app.use(bodyParser.json())
app.use(expressValidator())
app.use('/', route);
port = process.env.port
app.use(express.static('../FundooNote'));


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