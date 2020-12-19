const mongoose = require('mongoose');

let mongodb = null;
const initMongo = function () {
  // 127.0.0.1 works when app-server is not running inside of its docker container
  // const connectStringMongoose = 'mongodb://127.0.0.1:27017/test'; 

  // 172.17.0.1 is the docker user defined network gateway ip
  // it gets assigned to skillup-network when the network gets created
  const connectStringMongoose = 'mongodb://172.17.0.1:27017/test';

  // const dbName = 'skill-up-db';
  console.log('app-server is connecting to mongo...')
  mongoose.connect(connectStringMongoose, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('app-server is connected to mongodb...')
    });

  const db = mongoose.connection;

  // db.on('error', console.error.bind(console, 'connection error:'));
  db.on('error', err => {
    console.log('MONGODB ERROR:')
    console.log(err);
  });

  db.once('open', () => {
    console.log('mongoose is connected: ' + connectStringMongoose)
    // TODO: add schemas
  });

  return db;
}


// module.exports = mongodb;
module.exports = initMongo();
