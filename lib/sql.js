const cmd = require('node-cmd');
const chalk = require('chalk');

module.exports = {
  buildStatement(config, evalStatement) {
    const login = `mysql -u"${config.sql.user}" -p"${config.sql.pass}"`;
    const evalString = `-e"${evalStatement}"`;
    return `${login} ${evalString}`;
  },

  run(config, sqlOptions) {
    cmd.get(
      this.buildStatement(config, sqlOptions.sqlStatement),
      (data, err) => {
        if (err) throw err;
        console.log(chalk.green(sqlOptions.successStatement));
        if (sqlOptions.callback) {
          sqlOptions.callback(config);
        }
      }
    );
  }
}