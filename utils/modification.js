/** @format */

const mysql = require("mysql2");
const { prompt } = require("inquirer");

const db = mysql.createConnection(
  { host: "localhost", user: "root", password: "", database: "business_db" },
  console.log("Connected to the business_db.")
);

const depQuestions = [
  {
    type: "input",
    name: "department",
    message: "What would you like to call the new Department?",
  },
];

function addDepartment(input) {
  const newDepartment = { name: input.department };
  db.query(
    "INSERT INTO department (name) VALUES(?);",
    newDepartment.name,
    (error, result) => {
      if (error) throw error;
      console.log(`${newDepartment.name} was added.`);
    }
  );
}

function addRole() {
  db.query("SELECT * FROM DEPARTMENT;", function (err, results) {
    if (err) {
      console.log(err);
    }
  });
  prompt.roleQuestions = [
    {
      type: "input",
      name: "title",
      message: "What would you like to call the new role?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the new role?",
    },
    {
      type: "list",
      name: "department",
      message: "Select the department the new role belongs in",
      choices: [results],
    },
  ];
  const newRole = {
    title: input.title,
    salary: input.salary,
    department_id: input.department,
  };
  db.query("INSERT INTO role SET ?", newRole, (error, result) => {
    if (error) throw error;
    console.log(`${newRole.title} was added.`);
  });
}

module.exports = { addDepartment, depQuestions, addRole };
