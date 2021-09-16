let projectConfig = require(`./project.config.${process.env.BUILD_ENV || 'dev'}`);
module.exports = projectConfig;