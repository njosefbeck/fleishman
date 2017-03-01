const chalk = require('chalk');
const sql = require('./sql');

function createUser(config) {
  const sqlOptions = {
    sqlStatement: `CREATE USER '${config.db.user}'@'localhost' IDENTIFIED BY '${config.db.pass}'`,
    successStatement: `The ${chalk.yellow(config.db.user)} user has been created with the following password: ${chalk.yellow(config.db.pass)}`,
    callback: grantUserPrivileges
  };
  sql.run(config, sqlOptions);
}

function grantUserPrivileges(config) {
  const sqlOptions = {
    sqlStatement: `GRANT ALL PRIVILEGES ON ${config.db.name}.* TO '${config.db.user}'@'localhost'`,
    successStatement: `The ${chalk.yellow(config.db.user)} user has been granted privileges for the ${chalk.yellow(config.db.name)} database.`
  };
  sql.run(config, sqlOptions);
}

module.exports = {
  createDatabaseAndUser(config) {
    const sqlOptions = {
      sqlStatement: `CREATE DATABASE ${config.db.name}`,
      successStatement: `The ${chalk.yellow(config.db.name)} database has been created on localhost.`,
      callback: createUser
    };
    sql.run(config, sqlOptions);
  }
}