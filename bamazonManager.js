var mysql = require("mysql");
var inquirer = require("inquirer");

//if using node version before 10.0, need to require console.table by removing comment designation from line below
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
    managerOptions();
});

function managerOptions() {
    inquirer.prompt([
        {
            type: "list",
            name: "managerOption",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        }
    ]).then(function (choice) {
        switch (choice.managerOption) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
        };
    });
};

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        managerOptions();
    });
};

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.table(res);
        managerOptions();
    });
};

function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        inquirer.prompt([
            {
                type: "input",
                name: "productID",
                message: "What is the ID of the product to which you wish to add inventory?"
            },
            {
                type: "input",
                name: "quantity",
                message: "How many do you wish to add?"
            },
        ]).then(function (updateQty) {
            if (isNaN(updateQty.productID) || isNaN(updateQty.quantity)) {
                console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                console.log("\nPlease enter a valid ID and quantity (numbers only)");
                console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");
                addInventory();
            } else {
                connection.query("UPDATE products SET stock_quantity = stock_quantity + " + updateQty.quantity + " WHERE id = " + updateQty.productID + ";");
                console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                console.log("\nUpdate successful");
                console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");
                managerOptions();
            }
        });
    });
};


function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "productName",
            message: "What is the name of the product?"
        },
        {
            type: "list",
            name: "department",
            message: "What system is it for?",
            choices: [
                "Playstation 4", "Nintendo Switch", "Xbox One"
            ]
        },
        {
            type: "input",
            name: "price",
            message: "What is the price per unit?"
        },
        {
            type: "input",
            name: "quantity",
            message: "How many are in stock?"
        },
    ]).then(function (newItem) {
        if (isNaN(newItem.price) || isNaN(newItem.quantity)) {
            console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.log("\nPlease enter a valid price and quantity (numbers only)");
            console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");
            addProduct();
        } else {
            connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (\"" + newItem.productName + "\", \"" + newItem.department + "\", \"" + newItem.price + "\", \"" + newItem.quantity + "\")");
            managerOptions();
        };
    });
};