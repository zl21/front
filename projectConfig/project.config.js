let projectConfig = require(`./project.config.${process.env.BUILD_ENV || '1.4'}`);
module.exports = projectConfig;