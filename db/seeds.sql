INSERT INTO department (name)
VALUES ('Human Resources'), ('IT Department'), ('Finance');

INSERT INTO
    role (title, salary, department_id)
VALUES ('HR Manager', 60000.00, 1), (
        'Software Developer',
        80000.00,
        2
    ), (
        'Financial Analyst',
        70000.00,
        3
    );

INSERT INTO
    employee (
        first_name,
        last_name,
        role_id,
        manager_id
    )
VALUES ('John', 'Doe', 1, NULL),
    -- HR Manager, no manager ('Jane', 'Smith', 2, 1),
    -- Software Developer, managed by John Doe ('Bob', 'Johnson', 3, 1);
-- Financial Analyst, managed by John Doe