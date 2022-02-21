// import the config settings
const Config = require('../constants/backendConfig');

// get the mongoDB url from the config object
const url = Config.mongodb.local.url;

// import mongoose and setup the connection
var mongoose = require('mongoose');
mongoose
    .connect(url)
    .then(() => console.log('Connected to mongoDB'))
    .catch((error) => console.log(error));

module.exports = mongoose;
