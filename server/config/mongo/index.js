
const getMongoSettings = () => {
  console.log('NODE_ENV =', process.env.NODE_ENV);
  let mongoConfig = null;
  if (process.env.MODE === 'local') {
    mongoConfig = {
      mongoDB: `mongodb://frameworkuser:${process.env.MONGO_LOCAL_PASSWORD}@localhost:56701/frameworkServiceLocal`,
      jwtSecret: process.env.JWT_SECRET,
    }
  } else if (process.env.MODE === 'development') {
    mongoConfig = {
      mongoDB: `mongodb://frameworkuser:${process.env.MONGO_DEV_PASSWORD}@dev.frameworks.mongo.viewportmedia.org:27017/frameworkServiceDev`,
      jwtSecret: process.env.JWT_SECRET,
    }
  } else {
    mongoConfig = {
      mongoDB: `mongodb://frameworkuser:${process.env.MONGO_PROD_PASSWORD}@localhost:56701/frameworkService`,
      jwtSecret: process.env.JWT_SECRET,
    }
  }
  return mongoConfig;
}

module.exports = getMongoSettings;
