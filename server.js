/** @format */
const mysql = require("mysql2");
const { prompt } = require("inquirer");
const lists = require("./utils/navigation.js");
const { addDepartment, depQuestions, addRole } = require("./utils/modification.js");
require("console.table");

const db = mysql.createConnection(
  { host: "localhost", user: "root", password: "", database: "business_db" },
  console.log("Connected to the business_db.")
);

async function init() {
  selectionFunction();
}

function selectionFunction() {
  const lists = [
    {
      type: "list",
      name: "main",
      message: "Select from the following",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add A Department",
        "Add A Role",
        "Add An Employee",
        "Update An Employee",
        "Exit",
      ],
    },
  ];
  prompt(lists).then((input) => {
    if (input.main === "View All Departments") {
      db.query("SELECT * FROM DEPARTMENT;", function (err, results) {
        if (err) {
          console.log(err);
        }
        console.table(results);
        selectionFunction();
      });
    }
    if (input.main === "View All Roles") {
      db.query("SELECT * FROM ROLE;", function (err, results) {
        if (err) {
          console.log(err);
        }
        console.table(results);
        selectionFunction();
      });
    }
    if (input.main === "View All Employees") {
      db.query("SELECT * FROM EMPLOYEE;", function (err, results) {
        if (err) {
          console.log(err);
        }
        console.table(results);
        selectionFunction();
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
      addRole();
    }
  });

  async function addRole() {
    await db
      .promise()
      .query("SELECT * FROM DEPARTMENT;")
      .then(([results]) => {
        const departments = results.map(({ id, name }) => ({
          name: name,
          value: id,
        }));
        prompt([
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
            choices: departments,
          },
        ]).then((input) => {
          const newRole = {
            title: input.title,
            salary: input.salary,
            department_id: input.department,
          };
          db.query("INSERT INTO role SET ?", newRole, (error) => {
            if (error) throw error;
            console.log(`${newRole.title} was added.`);
          });
          selectionFunction();
        });
      });
  }
}



init();
