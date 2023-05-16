INSERT INTO department (id, name)
VALUES (001, "Department 1"),
       (002, "Department 2"),
       (003, "Department 3");

INSERT INTO role (id, title, salary, department_id)
VALUES (001, "manager", 100000, 001),
       (002, "hr", 60000, 002),
       (003, "worker", 20000, 003);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (001, "Big", "Boss", 001, null),
       (002, "Little", "Boss", 002, 001),
       (003, "Dan", "Schman", 003, 002),
       (004, "Joe", "Schmoe", 003, 002);