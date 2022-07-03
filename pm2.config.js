module.exports = {
  apps : [
    {
      name   : "dev.frameworks.service.viewportmedia.org",
      script : "./server/bin/www",
      env_production: {
        NODE_ENV: "production",
        MODE: "prod",
      },
      env_development: {
        NODE_ENV: "development",
        MODE: "dev",
      },
    },
  ],
};
