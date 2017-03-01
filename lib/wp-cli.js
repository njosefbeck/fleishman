const wpCli = require('node-wp-cli');
const chalk = require('chalk');

module.exports = {
  run(config, cliConfig) {
    console.log(chalk.magenta(cliConfig.messages.start));
    wpCli.call(cliConfig.command, cliConfig.options, (err, resp) => {
        if (err) throw err;
        console.log(resp.message);
        console.log(chalk.green(cliConfig.messages.success));
        cliConfig.callback(config);
      }
    );
  }
}