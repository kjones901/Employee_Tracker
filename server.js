/** @format */
const mysql = require("mysql2");
const { prompt } = require("inquirer");
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
      addDepartment();
    }
    if (input.main === "Add A Role") {
      addRole();
    }
    if (input.main === "Add An Employee") {
      addEmployee();
    }
    if (input.main === "Update An Employee") {
      updateEmployee();
    }
  });

  async function addDepartment() {
    prompt([
      {
        type: "input",
        name: "department",
        message: "What would you like to call the new Department?",
      },
    ]).then((input) => {
      const newDepartment = { name: input.department };
      db.query(
        "INSERT INTO department (name) VALUES(?);",
        newDepartment.name,
        (error) => {
          if (error) throw error;
          console.log(`${newDepartment.name} was added.`);
        }
      );
      selectionFunction();
    });
  }

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

  async function addEmployee() {
    const [roleResults, employeeResults] = await Promise.all([
      db.promise().query("SELECT * FROM ROLE;"),
      db.promise().query("SELECT * FROM EMPLOYEE;"),
    ]);
    const roles = roleResults[0].map(({ id, title }) => ({
      value: id,
      name: title,
    }));
    const managers = employeeResults[0].map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`,
    }));
    prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "role",
        message: "Select the new employee's role.",
        choices: roles,
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the new employee's manager?",
        choices: managers,
      },
    ]).then((input) => {
      const newEmployee = {
        first_name: input.first_name,
        last_name: input.last_name,
        role_id: input.role,
        manager_id: input.manager,
      };
      db.query("INSERT INTO employee SET ?", newEmployee, (error) => {
        if (error) throw error;
        console.log(`${newEmployee.first_name} ${newEmployee.last_name} was added.`);
      });
      selectionFunction();
    });
  }

  async function updateEmployee() {
    const [roleResults, employeeResults] = await Promise.all([
      db.promise().query("SELECT * FROM ROLE;"),
      db.promise().query("SELECT * FROM EMPLOYEE;"),
    ]);
    const roles = roleResults[0].map(({ id, title }) => ({
      value: id,
      name: title,
    }));
    const employees = employeeResults[0].map(
      ({ id, first_name, last_name, role_id }) => ({
        value: id,
        role_id: role_id,
        name: `${first_name} ${last_name}`,
      })
    );
    prompt(
      {
        type: "list",
        name: "employeeId",
        message: "Select an employee to update",
        choices: employees,
      },
      {
        type: "list",
        name: "newRole",
        message: "Select the employee's new role",
        choices: roles,
      }
    ).then((input) => {
      const updatedEmployee = {
        role_id: input.newRole,
        id: input.employeeId,
      };
      db.query(
        "UPDATE employee SET role_id = ? WHERE id = ?",
        [updatedEmployee.role_id, updatedEmployee.id],
        (error) => {
          if (error) throw error;
          console.log(
            `${updatedEmployee.first_name} ${updatedEmployee.last_name} was updated.`
          );
        }
      );
      selectionFunction();
    });
  }
}

init();
