#!/usr/bin/env node
const chalk = require ('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');

const wp = require('./lib/wp');

console.log(chalk.cyan(figlet.textSync('fleishman', {
  horizontalLayout: 'full'
})));

function getSelectionFromTableOfContents(callback) {
  const questions = [
    {
      name: 'tableOfContents',
      type: 'list',
      message: chalk.green('Select what you would like to do from the list below.'),
      choices: [
        {
          name: chalk.green('Install WordPress locally'),
          value: 'installwp'
        }
      ]
    }
  ];

  inquirer.prompt(questions).then(callback);
}

function routeToProperWorkflow(answers) {
  const selection = answers.tableOfContents;
  switch (selection) {
    case 'installwp':
      wp.install();
      break;
    default:
      console.log('Sorry, I do not recognize that selection.');
  }
}

getSelectionFromTableOfContents(routeToProperWorkflow);
