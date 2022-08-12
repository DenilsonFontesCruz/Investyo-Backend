const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.DATABASE_URL;

mongoose.connect(url);

module.exports = mongoose.connection;