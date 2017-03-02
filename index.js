#!/usr/bin/env node
const chalk = require ('chalk');
const inquirer = require('inquirer');
const emoji = require('node-emoji');

const wp = require('./lib/wp');

console.log(chalk.cyan.bold(`
FLEISHMAN ${emoji.get('heart')}  v1.0.1
-------------------`));

function getSelectionFromTableOfContents(callback) {
  const questions = [
    {
      name: 'tableOfContents',
      type: 'list',
      message: chalk.green('Select what you would like to do from the list below.'),
      choices: [
        {
          name: chalk.green('Create a local WordPress project'),
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
