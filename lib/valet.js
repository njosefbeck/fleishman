const chalk = require('chalk');
const cmd = require('node-cmd');

module.exports = {
  createLink(config) {
    console.log(chalk.magenta(`Creating Valet link...`));
    cmd.get(
      `
      cd ./${config.site.directory}/http
      valet link ${config.site.directory}
      `,
      (data, err, stderr) => {
        if (err) throw err;
        console.log(data);
      }
    );
  }
}