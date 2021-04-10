if (process.env.MODE === 'dev') {
  // console.log(process.env.MONGO_DEV);
  module.exports = {
    // mongoDB: process.env.MONGO_CONNECT_TEST,
    mongoDB: process.env.MONGO_DEV,
    // mongoSession: process.env.MONGO_SESSION_DEV,
    jwtSecret: process.env.JWT_SECRET,
  }
} else {
  module.exports = {
    mongoDB: process.env.MONGO_PROD,
    // mongoSession: process.env.MONGO_SESSION_PROD,
    jwtSecret: process.env.JWT_SECRET,
  }
}

