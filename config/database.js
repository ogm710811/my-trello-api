/*jslint node: true */
'use strict';

const mongoose = require('mongoose');
require('dotenv').config();
mongoose.Promise = global.Promise;

//******************************************************
// set DB connection string to use the value we have 
// in the environment variable:
//******************************************************
//mongoose.connect(`mongodb://localhost/${dbName}`);
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {  
  console.log(`Connected to the ${ process.env.MONGODB_URI } database`);
});