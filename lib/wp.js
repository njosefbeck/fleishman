const chalk = require ('chalk');
const inquirer = require('inquirer');
const yaml = require('node-yaml');

const files = require('./files');
const db = require('./db');
const wpInstall = require('./wp-install');

const wpQuestions = [
  {
    name: 'directory',
    type: undefined,
    prompt: 'What do you want your directory name to be? It must include the TLD in the name. (ex: barbara.com)',
    errorMessage: undefined,
    validateFn: (input) => {
      if (!input) {
        return chalk.red('Please enter a directory name, thanks!');
      }

      const currentDirectoryFiles = files.getContentsOfDirectory('.');
      if (currentDirectoryFiles.find((file) => file === input)) {
        return chalk.red('This directory already exists.')
      }

      return true;
    }
  },
  {
    name: 'siteUrl',
    type: undefined,
    prompt: 'What do you want your site URL to be? Ex: hello.com',
    errorMessage: 'Gimme that site URL!',
    validateFn: undefined
  },
  {
    name: 'mysqlUser',
    type: undefined,
    prompt: 'What\'s your MySQL username?',
    errorMessage: 'I need your username to run! Please input it, thanks.',
    validateFn: undefined
  },
  {
    name: 'mysqlPass',
    type: 'password',
    prompt: 'What\'s your MySQL password?',
    errorMessage: 'I need your password to run! Please input it, thanks.',
    validateFn: undefined
  },
  {
    name: 'dbName',
    type: undefined,
    prompt: 'What name do you want for your WordPress database?',
    errorMessage: 'I need your WordPress database name to run! Please input it, thanks.',
    validateFn: undefined
  },
  {
    name: 'dbUser',
    type: undefined,
    prompt: 'What do you want your WordPress database username to be?',
    errorMessage: 'I need your WordPress database username to run! Please input it, thanks.',
    validateFn: undefined
  },
  {
    name: 'dbPass',
    type: 'password',
    prompt: 'What do you want that username\'s password to be?',
    errorMessage: 'I need the desired password for your WordPress user to run! Please input it, thanks.',
    validateFn: undefined
  },
  {
    name: 'adminUser',
    type: undefined,
    prompt: 'What do you want your WordPress admin username to be?',
    errorMessage: 'I need the desired admin username! Please input it, thanks.',
    validateFn: undefined
  },
  {
    name: 'adminPass',
    type: undefined,
    prompt: 'What do you want the password for your WordPress admin username to be?',
    errorMessage: 'I need the desired admin password! Please input it, thanks.',
    validateFn: undefined
  },
  {
    name: 'adminEmail',
    type: undefined,
    prompt: 'What do you want the email for your WordPress admin username to be?',
    errorMessage: 'I need the desired admin email! Please input it, thanks.',
    validateFn: undefined
  }
];

const defaultValidate = (input) => {
  if (!input) {
    return chalk.red(errorMessage);
  }

  return true;
};

function createQuestion(name, type = "input", prompt, errorMessage, validateFn = defaultValidate) {
  return {
    name,
    type,
    message: chalk.green(prompt),
    validate: validateFn
  }
}

function getUserPreferences() {
  const questions = [];
  wpQuestions.forEach((question) => {
    questions.push(
      createQuestion(question.name, question.type, question.prompt, question.errorMessage, question.validateFn)
    );
  });

  return inquirer.prompt(questions);
}

function getYamlConfig(pathToYaml) {
  try {
    return yaml.readSync(pathToYaml);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }
}

function runInstallWithYaml() {
  const yamlFile = getYamlConfig(`${process.cwd()}/fleishman.yaml`);
  
  console.log(chalk.bgGreen.black('\nOh! It looks like you know what you\'re doing! I\'ll now build your WordPress project locally based on your YAML configuration...\n'));
  
  runInstallSteps(yamlFile);

}

function runInstallSteps(answers) {
  const config = {
    site: {
      directory: answers.directory,
      url: answers.siteUrl
    },
    admin: {
      user: answers.adminUser,
      pass: answers.adminPass,
      email: answers.adminEmail
    },
    sql: {
      user: answers.mysqlUser,
      pass: answers.mysqlPass
    },
    db: {
      name: answers.dbName,
      user: answers.dbUser,
      pass: answers.dbPass
    }
  }

  // Create WordPress project directories
  files.createDirectory('./', config.site.directory);
  files.createDirectory('./', `${config.site.directory}/http`);

  // Create database and user for WordPress project
  db.createDatabaseAndUser(config);

  // Download and install WordPress into project directories
  wpInstall.downloadAndInstall(config);
}

module.exports = {
  install() {
    console.log(chalk.green('\nLooks like you want to install WordPress locally. Great! I\'ll walk you through installing WordPress, creating a new MySql database, and linking your new WordPress site to Valet.'));

    if (getYamlConfig(`${process.cwd()}/fleishman.yaml`)) {
      return runInstallWithYaml();
    }

    console.log(chalk.yellow.bold(`\nPlease make sure you are running me in the parent directory where you keep all of your local site code (ex: Sites). Currently you\'re in ${chalk.yellow(files.getCurrentDirectoryBase())}. If this is where you want to install your WordPress directory, great! Continue. Otherwise, move to that directory and restart me. Thanks.`));

    getUserPreferences()
      .then(runInstallSteps)
      .catch((err) => console.log(err));
  }
};