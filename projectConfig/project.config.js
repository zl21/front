let projectConfig = require(`./project.config.${process.env.BUILD_ENV}`);
module.exports = projectConfig;