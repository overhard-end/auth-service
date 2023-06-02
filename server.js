require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const Fingerprint = require('express-fingerprint');
const router = require('./src/router');
const app = express();
const port = 5000;

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use(Fingerprint([Fingerprint.default]));

app.use('/api', router);
mongoose.set('strictQuery', false);

async function start() {
  try {
    mongoose.connect(process.env.DB_URL, { dbName: process.env.DB_NAME }, () =>
      console.log('db connection established'),
    );
    app.listen(port, () => console.log('Server has been started on port:', port));
  } catch (error) {
    console.log(error);
  }
}
start();
