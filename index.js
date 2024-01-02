const inquirer = require('inquirer');
const mysql = require('mysql');
const Table = require('cli-table');
require('dotenv').config()

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const promptList = async () => {
  const answer = await inquirer.prompt({
    type: 'list',
    name: 'selectedOption',
    message: 'Select an option:',
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'quit'],
  });

  console.log(`You selected: ${answer.selectedOption}`);

  // Call another function based on the selected option
  handleSelectedOption(answer.selectedOption);
};

const handleSelectedOption = async (selectedOption) => {
  // Perform actions based on the selected option
  if (selectedOption === 'view all departments') {
    console.log('You selected to view all departments');
    connection.query('SELECT * FROM department', (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return;
      }

      const table = new Table({
        head: ['ID', 'Name'],
      });

      // Extract the relevant data from each row
      results.forEach((row) => {
        // Check for null values in each column
        const formattedRow = [
          row.id !== null ? row.id : 'NULL',
          row.name !== null ? row.name : 'NULL',
        ];
        table.push(formattedRow);
      });

      if (results.length === 0) {
        console.log('No data found.');
      } else {
        console.log(table.toString());
      }

      backToMainMenu()
    });
  } else if (selectedOption === 'view all roles') {
    console.log('You selected to view all roles');
    connection.query('SELECT * FROM role', (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return;
      }

      const table = new Table({
        head: ['ID', 'title', 'salary', 'department_id'],
      });

      // Extract the relevant data from each row
      results.forEach((row) => {
        // Check for null values in each column
        const formattedRow = [
          row.id !== null ? row.id : 'NULL',
          row.title !== null ? row.title : 'NULL',
          row.salary !== null ? row.salary : 'NULL',
          row.department_id !== null ? row.department_id : 'NULL',
        ];
        table.push(formattedRow);
      });

      if (results.length === 0) {
        console.log('No data found.');
      } else {
        console.log(table.toString());
      }

      backToMainMenu()
    });
  } else if (selectedOption === 'view all employees') {
    console.log('You selected to view all employees');
    connection.query('SELECT * FROM employee', (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return;
      }

      const table = new Table({
        head: ['ID', 'first_name', 'last_name', 'role_id', 'manager_id'],
        style: { 'margin-top': 5, 'margin-left': 5 },
      });

      // Extract the relevant data from each row
      results.forEach((row) => {
        // Check for null values in each column
        const formattedRow = [
          row.id || '',
          row.first_name || '',
          row.last_name || '',
          row.role_id || '',
          row.manager_id !== null ? row.manager_id : 'NULL',
        ];
        table.push(formattedRow);
      });

      if (results.length === 0) {
        console.log('No data found.');
      } else {
        console.log(table.toString());
      }

      backToMainMenu()
    });
  } else if (selectedOption === 'add a department') {
    console.log('You selected to add a department');
    try {
      const answer = await inquirer.prompt({ message: 'Enter your department name', name: 'name' });

      console.log('ADD TO TABLE DEPARTMENTS');
      connection.query('INSERT INTO department (name) VALUES (?)', [answer.name], (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          return;
        }

        backToMainMenu()
    });
    } catch (error) {
      console.error('Error:', error.message);
    }
  } else if (selectedOption === 'add a role') {
    addRole(); // Call the addRole function
  } else if (selectedOption === 'add an employee') {
    addEmployee(); // Call the addEmployee function
  } 
  else if (selectedOption === 'update an employee role'){
    updateEmployee();
  } 
  else {
    console.log('Invalid option');
  }
};

const addRole = async () => {
  console.log('You selected to add a role');

  try {
    const titleAnswer = await inquirer.prompt({ message: 'Enter title for role', name: 'title' });
    const salaryAnswer = await inquirer.prompt({ message: 'Enter salary for role', name: 'salary' });

    connection.query('INSERT INTO role (title, salary) VALUES (?, ?)', [titleAnswer.title, salaryAnswer.salary], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return;
      }

      console.log('Role added successfully');

      // Close the connection when done
      backToMainMenu()
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const addEmployee = async () => {
  console.log('You selected to add an employee');

  try {
    const firstNameAnswer = await inquirer.prompt({ message: 'Enter first name for employee', name: 'first_name' });
    const lastNameAnswer = await inquirer.prompt({ message: 'Enter last name for employee', name: 'last_name' });

    connection.query('INSERT INTO employee (first_name, last_name) VALUES (?, ?)', [firstNameAnswer.first_name, lastNameAnswer.last_name], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return;
      }

      console.log('Employee added successfully');

      backToMainMenu()
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
};
const queryAsync = (sql, values) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  };
  
  const updateEmployee = async () => {
    console.log('You selected to update an employee');
  
    try {
      const results = await queryAsync('SELECT * FROM employee');
  
      if (!Array.isArray(results) || results.length === 0) {
        console.log('No employees found for updating.');
        backToMainMenu()
        return;
      }
  
      const answer = await inquirer.prompt({
        type: 'list',
        name: 'selectedEmployeeId',
        message: 'Select an employee to update:',
        choices: results.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
      });
  
      console.log(`You selected to update employee with ID: ${answer.selectedEmployeeId}`);
  
      const firstNameAnswer = await inquirer.prompt({ message: 'Enter new first name for employee', name: 'first_name' });
      const lastNameAnswer = await inquirer.prompt({ message: 'Enter new last name for employee', name: 'last_name' });
  
      await queryAsync(
        'UPDATE employee SET first_name = ?, last_name = ? WHERE id = ?',
        [firstNameAnswer.first_name, lastNameAnswer.last_name, answer.selectedEmployeeId]
      );
  
      console.log('Employee updated successfully');
  
      // Close the connection when done
      backToMainMenu()
    } catch (error) {
      console.error('Error:', error.message);
      backToMainMenu()
    }
  };

  const backToMainMenu = async () => {
    const { returnToMainMenu } = await inquirer.prompt({
      type: 'list',
      name: 'returnToMainMenu',
      message: 'Return to Main Menu or Quit?',
      choices: ['Main Menu', 'Quit'],
    });
  
    if (returnToMainMenu === 'Main Menu') {
      promptList();
    } else {
      console.log('Goodbye!');
      connection.end();
    }
  };
  
  // Call the prompt function
  promptList();