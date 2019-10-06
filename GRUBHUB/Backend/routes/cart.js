const express = require('express');
const pool = require('../configFiles/connectionPooling');
var mysql = require('mysql');
const app = express.Router();

//addToCart
app.post('/addToCart', (req, res) => {
    console.log("In addToCart post");
    console.log(req.body);
    console.log(req.session);
  
    console.log(localStorage.getItem('userEmail'))
  
    if (localStorage.getItem('userEmail')) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log("Error while connecting to database");
                res.status(500).end("Error while connecting to database");
            } else {
                //query
                const sql1 = `SELECT userEmail FROM cart WHERE userEmail= ${mysql.escape(localStorage.getItem('userEmail'))}`;
                console.log(sql1);
                conn.query(sql1, (err, result) => {
                    if (err) {
                        console.log("Error while connecting to cart table");
                        res.status(500).end("Error while connecting Cart table");
                    } else {
                        console.log(result);
                        if (result.length === 0) {
                            //addToCart
                            console.log("User has no previous orders");
                            const sql2 = `SELECT * FROM items WHERE itemId = ${req.body.itemId}`;
                            console.log(sql2);
  
                            conn.query(sql2, (err, result1) => {
                                if (err) {
                                    console.log("Error while connecting to items db");
                                    res.status(500).end("Error while connecting to items db");
                                } else {
                                    console.log(result1);
                                    console.log(result1[0].itemName + "");
  
                                    const sql3 = `INSERT INTO cart (userEmail,itemId,restId,itemName,itemPrice,itemImage,itemQuantity,itemTotal)
                                                VALUES (${mysql.escape(localStorage.getItem('userEmail'))},
                                                ${req.body.itemId}, ${req.body.restId},
                                                ${mysql.escape(result1[0].itemName)},
                                                ${result1[0].itemPrice},
                                                ${mysql.escape(result1[0].itemImage)},
                                                ${req.body.itemQuantity},
                                                ${req.body.itemTotal})`;
  
                                    console.log(sql3);
  
                                    pool.getConnection((err, result) => {
                                        if (err) {
                                            console.log("Couldnt connect to database");
                                            res.status(500).end("Couldnt connect to cart db");
                                        } else {
                                            conn.query(sql3, (err, result) => {
                                                if (err) {
                                                    console.log("Error while connecting to cart database");
                                                } else {
                                                    console.log("Item added to cart successfully");
                                                    res.status(200).end("Item added to cart");
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            //user has previous orders
                            //check restId
                            const sql4 = `SELECT DISTINCT restId FROM cart WHERE userEmail= ${mysql.escape(localStorage.getItem('userEmail'))}`;
                            console.log(sql4);
  
                            pool.getConnection((err, conn) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).end("Error while connecting to cart db");
                                } else {
                                    conn.query(sql4, (err, result2) => {
                                        if (err) {
                                            console.log(err);
                                            res.status(400).end("Enter valid restId");
                                        } else {
                                            if (result2.length > 1) {
                                                console.log("Cant add to more than one restaurants at a time");
                                                res.status(405).end("Cant add items from more than one restaurant at a time");
                                            } else {
                                                console.log(result2);
                                                if (result2[0].restId === req.body.restId) {
                                                    //check itemId
                                                    const sql5 = `SELECT * FROM cart WHERE userEmail = ${mysql.escape(localStorage.getItem('userEmail'))} AND
                                                                   restId = ${req.body.restId}`;
                                                    console.log(sql5);
                                                    conn.query(sql5, (err, result) => {
                                                        if (err) {
                                                            (
                                                                console.log(err));
                                                            res.status(500).end("Error while connecting to cart db");
                                                        } else {
                                                            console.log(result);
                                                            //differentiate itemId
  
  
                                                            var hasItemId = false;
  
                                                            for (var index = 0; index < result.length; ++index) {
                                                                console.log("-------" + result[index].itemId);
                                                                if (result[index].itemId === req.body.itemId) {
                                                                    hasItemId = true;
                                                                    break;
                                                                }
                                                            }
                                                            //if itemId update
                                                            console.log("hasItemId---------------------------------------" + hasItemId);
                                                            if (hasItemId) {
                                                                const sql6 = `UPDATE cart set itemQuantity= ${req.body.itemQuantity} + ${result[0].itemQuantity},
                                                                                itemTotal = ${req.body.itemTotal} + ${result[0].itemTotal}
                                                                                WHERE userEmail= ${mysql.escape(localStorage.getItem('userEmail'))} AND
                                                                                restId = ${req.body.restId} AND 
                                                                                itemId = ${req.body.itemId}`;
  
                                                                console.log(sql6);
                                                                conn.query(sql6, (err, result) => {
                                                                    if (err) {
                                                                        console.log(err);
                                                                        // req.session.save();
                                                                        res.status(500).end("Error connecting to cart table");
                                                                    } else {
                                                                        console.log("Successfully updated cart");
                                                                        res.status(200).end("Successfully updated cart");
                                                                    }
                                                                });
                                                            } else {
                                                                //itemId not found insert
  
                                                                const sql7 = `SELECT * FROM items WHERE 
                                                                            restId = ${req.body.restId} AND itemId = ${req.body.itemId}`;
                                                                console.log(sql7);
                                                                conn.query(sql7, (err, result) => {
                                                                    if (err) {
                                                                        console.log(err);
                                                                        res.status(500).end("Error connecting to cart table");
                                                                    } else {
                                                                        //got item details
                                                                        console.log(result);
                                                                        const sql8 = `INSERT INTO cart (userEmail,itemId,restId,itemName,itemPrice,itemImage,itemQuantity,itemTotal)
                                                                            VALUES (${mysql.escape(localStorage.getItem('userEmail'))},
                                                                                    ${req.body.itemId}, ${req.body.restId}, 
                                                                                    ${mysql.escape(result[0].itemName)},
                                                                                    ${result[0].itemPrice}, ${mysql.escape(result[0].itemImage)},
                                                                                    ${req.body.itemQuantity}, ${req.body.itemTotal})`;
                                                                        console.log(sql8);
  
                                                                        conn.query(sql8, (err, result) => {
                                                                            if (err) {
                                                                                console.log(err);
                                                                                res.status(500).end("Error inserting to cart table");
                                                                            } else {
                                                                                console.log("Successfully added to cart");
                                                                                res.status(200).end("Successfully added to cart");
                                                                            }
                                                                        })
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    console.log("Cant add to more than one restaurants at a time");
                                                    res.status(406).end("Cant add to more than one restaurants at a time");
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    } else {
        res.status(404).end("Please login again");
    }
  });

  // AllCart
app.post('/showCart', (req, res) => {
    console.log("In show cart");
    console.log(req.body);
    console.log(localStorage.getItem('userEmail'));
    if (localStorage.getItem('userEmail')) {
        console.log("user is set");
  
        pool.getConnection((err, conn) => {
            if (err) {
                console.log("Error while connecting to database");
                res.writeHead(500, {
                    'Content-type': 'text/plain'
                });
                res.end("Error while connecting to database");
            } else {
                //query
                const sql = `SELECT * FROM cart WHERE userEmail= ${mysql.escape(localStorage.getItem('userEmail'))}`;
                console.log(sql);
  
                conn.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(400).end("Couldnt get cart items");
                    } else {
                        console.log(result);
                        res.status(200).end(JSON.stringify(result));
                    }
                });
            }
        });
    }
  });

  //DeleteCartItem
app.post('/deleteCartItem', (req, res) => {
    console.log("In deleteCartItem");
    console.log(req.body);
  
    if (localStorage.getItem('userEmail')) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log("Error while connecting to database");
                res.writeHead(500, {
                    'Content-type': 'text/plain'
                });
                res.end("Error while connecting to database");
            } else {
                //query
                const sql = `DELETE FROM cart WHERE userEmail= ${mysql.escape(localStorage.getItem('userEmail'))}
                            AND itemId= ${req.body.itemId}`;
                console.log(sql);
                conn.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(400).end("Couldnt delete cart item");
                    } else {
                        console.log("Cart Item deleted successfully");
                        res.status(200).end("Cart Item deleted successfully");
                    }
                });
  
            }
        });
    }
  });


  module.exports = app;