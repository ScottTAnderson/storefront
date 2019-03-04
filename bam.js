var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

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
    readStore();
});

function updateQty(qty, id) {
    connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - " + qty + " WHERE id = " + id + ";"
    )
    readStore();
};

function readStore() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        inquirer.prompt([
            {
                type: "input",
                name: "productID",
                message: "Please enter the ID of the product you would like to purchase?"
            },

            {
                type: "input",
                name: "quantity",
                message: "How many would you like to purchase?"
            }
        ]).then(function(item) {
            updateQty(item.quantity, item.productID);
        })
    });
};

