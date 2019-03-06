var mysql = require("mysql");
var inquirer = require("inquirer");
// var cTable = require("console.table");

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

//If quantity check passes, update quantity
function updateQty(qty, id) {
    connection.query("UPDATE products SET stock_quantity = stock_quantity - " + qty + " WHERE id = " + id + ";");
    updateSales(qty, id);
    readStore();
};

function updateSales(qty, id) {
    connection.query("UPDATE products SET product_sales = IFNULL(product_sales,0) + " + qty + " * price WHERE id = " + id + ";");
}

//Connect one time to get status of store, and also make sure the ordered quantity isn't over the available quantity
function readStore() {
    connection.query("SELECT id, product_name, department_name, price, stock_quantity FROM products", function (err, res) {
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
        ]).then(function (order) {
            if (res[order.productID - 1] != undefined) {
                var stockQuantity = res[order.productID - 1].stock_quantity;
            } else {
                var stockQuantity = "NaN";
            }
            var orderQuantity = parseInt(order.quantity);
            if (isNaN(orderQuantity) || isNaN(stockQuantity)) {
                console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                console.log("\nPlease enter a valid ID and quantity (numbers only)");
                console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");
                readStore();
            } else {
                if (stockQuantity >= orderQuantity) {
                    updateQty(order.quantity, order.productID);
                } else {
                    console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                    console.log("\nInsufficient quantity for your order");
                    console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");
                    readStore();
                };
            };
        });
    });
};