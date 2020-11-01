const mongoose = require('mongoose');

const {
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME
} = process.env;

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
mongoose.pluralize(null); // Prevent Mongoose from pluralizing collection/model names

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log("MongoDB Connection Established"));