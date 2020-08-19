const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
require('dotenv').config();
const app = express();
app.set('view engine', 'ejs')

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

const Schema = mongoose.Schema;

const FraseSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    frase: {
        type: String,
        unique: true
    },
    autor: String
});

const Frase = mongoose.model('Frase', FraseSchema, 'frases');

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


app.get('/', async (req, res, next) => {

  const cant = await db.collection('frases').estimatedDocumentCount();
  const num = randomNum(0, cant-1);
  const frase = await db.collection('frases').findOne({ id: num });
  try {
    res.render(__dirname + '/public/views/index.ejs',{ frase: frase.frase, autor: frase.autor });
  } catch (error) {
    console.log(error);
  }
});


const port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log(`Escuchando en el puerto http://localhost:${port}`);
})
