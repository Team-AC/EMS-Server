const fs = require('fs');

// Destructuring command line arguments
const [
  ,
  ,
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME
 ] = process.argv;

fs.appendFileSync('.env', `DB_HOST=${DB_HOST}\n`)
fs.appendFileSync('.env', `DB_USER=${DB_USER}\n`)
fs.appendFileSync('.env', `DB_PASS=${DB_PASS}\n`)
fs.appendFileSync('.env', `DB_NAME=${DB_NAME}`)