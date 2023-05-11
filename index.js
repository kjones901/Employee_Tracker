/** @format */

const { prompt } = require("inquirer");
const questions = require("./utils/main_menu.js");

async function init() {
  const answers = await prompt(questions);
}

init();
