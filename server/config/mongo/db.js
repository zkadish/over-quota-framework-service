const getMongoSettings = require('./index');
const mongoose = require('mongoose');

const initMongo = async () => {
  const mongoConfig = getMongoSettings();
  try {
    await mongoose.connect(mongoConfig.mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('mongoDB connected', mongoConfig.mongoDB);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = { initMongo };
