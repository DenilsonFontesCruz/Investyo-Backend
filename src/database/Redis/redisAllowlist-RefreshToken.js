const redis = require("redis");
require('dotenv').config();

const url = process.env.REDIS_DATABASE_URL;

const client = redis.createClient({url, prefix: "allowlist:"});

client.connect();

module.exports = client;