/** @format */
const mysql = require("mysql2");
const { prompt } = require("inquirer");
const lists = require("./utils/navigation.js");
const { addDepartment, depQuestions, addRole } = require("./utils/modification.js");

const db = mysql.createConnection(
  { host: "localhost", user: "root", password: "", database: "business_db" },
  console.log("Connected to the business_db.")
);

async function init() {
  const choice = await prompt(lists);
  selectionFunction(choice);
}

function selectionFunction(input) {
  if (input.main === "View All Departments") {
    db.query("SELECT * FROM DEPARTMENT;", function (err, results) {
      if (err) {
        console.log(err);
      }
      console.table(results);
    });
  }
  if (input.main === "View All Roles") {
    db.query("SELECT * FROM ROLE;", function (err, results) {
      if (err) {
        console.log(err);
      }
      console.table(results);
    });
  }
  if (input.main === "View All Employees") {
    db.query("SELECT * FROM EMPLOYEE;", function (err, results) {
      if (err) {
        console.log(err);
      }
      console.table(results);
    });
  }
  if (input.main === "Add A Department") {
    async function add() {
      const answer = await prompt(depQuestions);
      addDepartment(answer);
    }
    add();
  }
  if (input.main === "Add A Role") {
    addRole()
  }
}
init();
