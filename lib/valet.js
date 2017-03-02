const chalk = require('chalk');
const cmd = require('node-cmd');
const emoji = require('node-emoji');

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
console.log(`
${emoji.get('smiley')}  ${chalk.green.bold('SUCCESS!')}
${chalk.green('Your local WordPress project has been set up, according to the following specifications:')}
${chalk.green.bold('WordPress Installed In:')} ${chalk.cyan(config.site.directory + '/http')}
${chalk.green.bold('Visit Your Site Here:')} ${chalk.cyan('http://' + config.site.directory + '.local')}
${chalk.green.bold('Admin Username:')} ${chalk.cyan(config.admin.user)}
${chalk.green.bold('Admin Password:')} ${chalk.cyan(config.admin.pass)}

${emoji.get('heart_eyes')}  ${chalk.green.bold('Thanks for using fleishman! Have a kick-ass day!')}
`
);
      }
    );
  }
}