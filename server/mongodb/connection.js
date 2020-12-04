const mongoose = require('mongoose');

const connectMongo = function () {
  const connectStringMongoose = 'mongodb://127.0.0.1:27017/test';
  // const dbName = 'skill-up-db';

  mongoose.connect(connectStringMongoose, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', () => {
    console.log('mongoose connection: ' + connectStringMongoose)
    // TODO: add schemas
  });

  return db;
}


module.exports = connectMongo;
