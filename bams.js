var mysql = require("mysql");
var inquirer = require("inquirer");

//if using node version < 10.0, need to require console.table by removing comment designation from line below
//require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Cadash50@",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id" + connection.threadId + "\n");
    supervisorOptions();
});

function supervisorOptions() {
    inquirer.prompt([
        {
            type: "list",
            name: "supervisorOption",
            message: "What would you like to do?",
            choices: [
                "View Product Sales by Department",
                "Create New Department"
            ]
        }
    ]).then(function (choice) {
        switch (choice.supervisorOption) {
            case "View Product Sales by Department":
                viewProductsByDept();
                break;
            case "Create New Department":
                addDepartment();
                break;
        };
    });
};

function viewProductsByDept() {
    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales, " +
    "products.product_sales - departments.over_head_costs AS total_profit " +
    "FROM departments " + 
    "INNER JOIN products " +
    "ON departments.department_name = products.department_name " +
    "GROUP BY departments.department_name;"
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        supervisorOptions();
    })
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "What is the name of the department?"
        },
        {
            type: "input",
            name: "overheadCosts",
            message: "What are the overhead costs?"
        },
    ]).then(function (newItem) {
        if (isNaN(newItem.overheadCosts)) {
            console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.log("\nPlease enter a valid overhead cost (numbers only)");
            console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");
            addDepartment();
        } else {
            connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES (\"" + newItem.departmentName + "\", \"" + newItem.overheadCosts + "\")");
            supervisorOptions();
        };
    });
};