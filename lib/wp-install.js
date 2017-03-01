const cli = require('./wp-cli');
const valet = require('./valet');

function createWPConfigFile(config) {
  const cliConfig = {
    command: 'core config',
    options: {
      path: `${config.site.directory}/http`,
      dbname: config.db.name,
      dbuser: config.db.user,
      dbpass: config.db.pass
    },
    messages: {
      start: `Now generating the WordPress config file with your database information...`,
      success: `WordPress config file successfully created!`
    },
    callback: runInstall
  };

  cli.run(config, cliConfig);
}

function runInstall(config) {
  const cliConfig = {
    command: 'core install',
    options: {
      path: `${config.site.directory}/http`,
      url: `${config.site.url}.local`,
      title: config.site.url,
      admin_user: config.admin.user,
      admin_password: config.admin.pass,
      admin_email: config.admin.email
    },
    messages: {
      start: `Running the world-famous 5-second WordPress install...`,
      success: `WordPress successfully installed into ${config.site.directory}/http!`
    },
    callback: valet.createLink
  };

  cli.run(config, cliConfig);
}

module.exports = {
  downloadAndInstall(config) {
    const cliConfig = {
      command: 'core download',
      options: {
        path: `${config.site.directory}/http`
      },
      messages: {
        start: `Now downloading Wordpress into ${config.site.directory}/http...`,
        success: `WordPress successfully downloaded into ${config.site.directory}/http!`
      },
      callback: createWPConfigFile
    };
    
    cli.run(config, cliConfig);
  }
}