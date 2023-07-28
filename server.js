require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const Fingerprint = require('express-fingerprint');
const router = require('./src/router');
const app = express();
const port = process.env.PORT;

app.use(cors({ credentials: true, origin:process.env.CLIENT_URL }));
app.use(express.json());
app.use(cookieParser());
app.use(Fingerprint([Fingerprint.default]));
app.use('/api', router);

mongoose.set('strictQuery', false);

async function start() {
  try {
    mongoose.connect(process.env.DB_URL, { dbName: process.env.DB_NAME }, () =>
      console.log('db is connected'),
    );
    app.listen(port, () => console.log('Server working on port:', port));
  } catch (error) {
    console.log(error);
  }
}
start();
