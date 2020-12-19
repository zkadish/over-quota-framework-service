const mongoose = require('mongoose');

const connectMongo = function () {
  const connectStringMongoose = 'mongodb://172.17.0.1:27017/test'; // looked up the ip address of the mongo container
  // const connectStringMongoose = 'mongodb://0.0.0.0:27017/test';
  // const connectStringMongoose = 'mongodb://127.0.0.1:27017/test';
  // const dbName = 'skill-up-db';
  console.log('Connecting to mongo...')
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
