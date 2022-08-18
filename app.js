require('dotenv').config();
const express = require('express');
const database = require('./src/config/database');

const indexRoute = require('./src/routes');

database.on("error", console.log.bind(console, `Database connection error`));
database.once("open", () => {
    console.log(`Database connection successful`);
})

const app = express();

app.use(express.json());

const port = process.env.PORT;

app.listen(port, (req, res) => {
    console.log(`Server is Running on http://localhost:${port}`);
    console.log('hello world...')
});