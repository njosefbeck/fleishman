const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

module.exports = {
  getCurrentDirectoryBase() {
    return path.basename(process.cwd());
  },
  getContentsOfDirectory(path) {
    return fs.readdirSync(path);
  },
  createDirectory(path, directory) {
    fs.mkdirSync(`${path}${directory}`);
    console.log(chalk.green(`The ${chalk.yellow(directory)} directory has been created in ${chalk.yellow(this.getCurrentDirectoryBase())}.`));
  }
}