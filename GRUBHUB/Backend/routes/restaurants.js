const express = require('express');
const pool = require('../configFiles/connectionPooling');
var mysql = require('mysql');
const app = express.Router();


//AllRestaurants
app.get('/allrestaurants', (req,res)=>{
    console.log("In allrestaurants GET");
    if (req.session.userEmail) {
    pool.getConnection((err,conn)=>{
        if(err){
            console.log("Error while connecting to database");
            res.writeHead(500,{
                'Content-type': 'text/plain'
            });
            res.end("Error while connecting to database");
        }else{
            //query
            const sql = `SELECT * FROM restaurants`;

            conn.query(sql, (err,result)=>{
                if(err){
                    res.writeHead(400,{
                        'Content-type' : 'text/plain'
                    });
                    res.end("Couldnt get cuisine names");
                }else{
                    if(result.length == 0){
                        res.writeHead(401,{
                            'Content-type': 'text/plain'
                        });
                        res.end("Sorry, No restaurants found");
                    }else{
                        res.writeHead(200, {
                            'Content-type': 'application/json'
                        });
                        res.end(JSON.stringify(result));
                    }
                }
            });
        }
    });
}
});

//restaurentsbyItemName
app.post('/restaurantsbyItemName', (req, res) => {
    console.log("In restaurantsbyItemName");
    console.log(req.body);
    console.log(req.session);
    
    if (req.session.userEmail) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log("Error while connecting to database");
                res.writeHead(500, {
                    'Content-type': 'text/plain'
                });
                res.end("Error while connecting to database");
            } else {
  
                //query
                const sql = `SELECT DISTINCT r.restName, r.restId, r.restImage, r.restDesc, r.restAddress,
                        i.cuisineId, i.cuisineName FROM restaurants r, items i
            WHERE r.restId= i.restId AND i.itemName LIKE '%${req.body.itemName + "%'"}`;
                console.log(sql);
                conn.query(sql, (err, result) => {
                    if (err) {
                        res.writeHead(400, {
                            'Content-type': 'text/plain'
                        });
                        console.log(err);
                        res.end("Invalid ItemName");
                    } else {
                        if (result.length == 0) {
                            res.writeHead(401, {
                                'Content-type': 'text/plain'
                            });
                            res.end("Sorry, No restaurants found with item " + req.body.itemName);
                        } else {
                            res.writeHead(200, {
                                'Content-type': 'application/json'
                            });
                            res.end(JSON.stringify(result));
                        }
                    }
                });
            }
        });
    }
  });

//restaurentsbyItemName & cuisineName
app.post('/restaurantsbyItemCuisine', (req, res) => {
    console.log("restaurantsbyItemCuisine");
    console.log(req.body);
    console.log(req.session);
  
    if (req.session.userEmail) {
  
  
        pool.getConnection((err, conn) => {
            if (err) {
                console.log("Error while connecting to database");
                res.writeHead(500, {
                    'Content-type': 'text/plain'
                });
                res.end("Error while connecting to database");
            } else {
  
                //query
                const sql = `SELECT DISTINCT r.restName, r.restId, r.restImage, r.restDesc, r.restAddress,
                        i.cuisineId,  i.cuisineName FROM restaurants r, items i
                    WHERE r.restId= i.restId AND i.cuisineName = ${mysql.escape(req.body.cuisineName)} AND 
                     i.itemName LIKE '%${req.body.itemName + "%'"}`;
                // const sql = `SELECT DISTINCT r.restName FROM restaurants r, items i WHERE r.restId=i.restId
                //     AND i.cuisineName = ${mysql.escape(req.body.cuisineName)} AND 
            //     AND i.cuisineName = ${mysql.escape(req.body.cuisineName)} AND 
                //     AND i.cuisineName = ${mysql.escape(req.body.cuisineName)} AND 
                //     i.itemName LIKE '%${req.body.itemName + "%'"}`;
                console.log(sql);
                conn.query(sql, (err, result) => {
                    if (err) {
                        res.writeHead(400, {
                            'Content-type': 'text/plain'
                        });
                        res.end("Invalid ItemName or cuisine name");
                    } else {
                        if (result.length == 0) {
                            res.writeHead(401, {
                                'Content-type': 'text/plain'
                            });
                            res.end("Sorry, No restaurants found with given item and cuisine");
                        } else {
                            res.writeHead(200, {
                                'Content-type': 'application/json'
                            });
                            console.log("restaurants found");
                            
                            res.end(JSON.stringify(result));
                        }
                    }
                });
            }
        });
    }
  });

//Get items by restaurant
app.post('/itemsByRestaurant', (req, res) => {
    console.log("In itemsByRestaurant");
    console.log(req.body.restId);
    console.log(req.session.userEmail);
  
    if (req.session.userEmail) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log("Error while connecting to database");
                res.writeHead(500, {
                    'Content-type': 'text/plain'
                });
                res.end("Error while connecting to database");
            } else {
                //query
                const sql = `SELECT i.*, r.* FROM items i, restaurants r
                            WHERE r.restId = i.restId AND r.restId = ${mysql.escape(req.body.restId)};`;
                console.log(sql);
                conn.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.writeHead(400, {
                            'Content-type': 'text/plain'
                        });
                        res.end("Couldnt get cuisine names");
                    } else {
                        console.log(result);
                        res.writeHead(200, {
                            'Content-type': 'text/plain'
                        });
                        res.end(JSON.stringify(result));
                    }
                });
  
            }
  
        });
    }
  });

//put restaurant details
app.put("/updaterestdetails", (req, res) => {
    console.log("Inside update restaurant");
  
    if (req.session.userEmail) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log("Error while creating connection");
                res.writeHead(500, {
                    "Content-type": "text/plain"
                });
                res.end("Error while creating connection");
            } else {
                const sql1 =
                    "SELECT userId from users WHERE userEmail = " +
                    mysql.escape(req.session.userEmail);
                console.log("sql1---" + sql1);
                conn.query(sql1, (err, result1) => {
                    if (err) {
                        console.log("Error in fetching User Id");
                        console.log(err);
                    } else {
                        console.log("User Id fetched");
  
                        console.log(result1[0]);
  
                        var sql2 =
                            "UPDATE restaurants SET " +
                            "restName = " +
                            mysql.escape(req.body.restName) +
                            "," +
                            "restAddress = " +
                            mysql.escape(req.body.restAddress) +
                            "," +
                            "restDesc = " +
                            mysql.escape(req.body.restDesc) +
                            "," +
                            "restZip = " +
                            mysql.escape(req.body.restZip) +
                            "," +
                            "restImage =" +
                            mysql.escape(req.body.restImage) +
                            "," +
                            "restPhone = " +
                            mysql.escape(req.body.restPhone) +
                            " WHERE userId = " +
                            result1[0].userId;
                        console.log("sql2------" + sql2);
  
                        conn.query(sql2, function (err, result2) {
                            if (err) {
                                console.log("Error in updating restaurant details");
                                console.log(err);
                                res.writeHead(400, {
                                    "Content-type": "text/plain"
                                });
                                console.log("err-----" + err);
                                res.end("Error in updating profile data");
                            } else {
                                console.log("restaurant details update complete!");
                                res.writeHead(200, {
                                    "Content-type": "text/plain"
                                });
                                res.end("restaurant details update complete!");
                            }
                        });
                    }
                });
            }
        });
    }
  });

  //AllCuisines
app.get('/getCuisines', (req,res)=>{
    console.log("In getCuisines");
    
    if (req.session.userEmail) {
    pool.getConnection((err,conn)=>{
        if(err){
            console.log("Error while connecting to database");
            res.writeHead(500,{
                'Content-type': 'text/plain'
            });
            res.end("Error while connecting to database");
        }else{
            //query
            const sql = `SELECT DISTINCT cuisineName FROM items`;
            //console.log(sql);
            conn.query(sql, (err,result)=>{
                if(err){
                    res.writeHead(400,{
                        'Content-type' : 'text/plain'
                    });
                    res.end("Couldnt get cuisine names");
                }else{
                    if(result.length == 0){
                        res.writeHead(401,{
                            'Content-type': 'text/plain'
                        });
                        res.end("Sorry, No cuisines found");
                    }else{
                        res.writeHead(200, {
                            'Content-type': 'application/json'
                        });
                        res.end(JSON.stringify(result));
                    }
                }
            });
        }
    });
}
});

//addItem
app.post("/additem", (req, res) => {
    console.log("Inside add items");
    if (req.session.userEmail) {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log("Error while creating connection");
          res.writeHead(500, {
            "Content-type": "text/plain"
          });
          res.end("Error while creating connection");
        } else {
          const sql1 =
            "SELECT r.restId from restaurants r, users u WHERE u.userId = r.userId and u.userEmail = " +
            mysql.escape(req.session.userEmail) +
            "and u.accountType = " +
            2;
          console.log("sql1---" + sql1);
          conn.query(sql1, (err, result1) => {
            if (err) {
              console.log("Error in retrieving Restaurant Id");
              res.writeHead(400, {
                "Content-type": "text/plain"
              });
              res.end("Error in retrieving Restaurant Id");
            } else {
              const sql2 =
                "SELECT cuisineId from items where cuisineName = " +
                mysql.escape(req.body.cuisineName);
              conn.query(sql2, (err, result2) => {
                if (err) {
                  console.log("Error in retrieving cuisine Id");
                  res.writeHead(401, {
                    "Content-type": "text/plain"
                  });
                  res.end("Error in retrieving cuisine Id");
                } else {
                  sql3 =
                    "Insert INTO items (itemName, itemDesc, itemImage, itemType, itemPrice, cuisineName, restId, cuisineId) VALUES ( " +
                    mysql.escape(req.body.itemName) +
                    "," +
                    mysql.escape(req.body.itemDesc) +
                    "," +
                    mysql.escape(req.body.itemImage) +
                    "," +
                    mysql.escape(req.body.itemType) +
                    "," +
                    mysql.escape(req.body.itemPrice) +
                    "," +
                    mysql.escape(req.body.cuisineName) +
                    "," +
                    result1[0].restId +
                    "," +
                    result2[0].cuisineId +
                    ");";
                  conn.query(sql3, (err, result3) => {
                    if (err) {
                      if (err.sqlMessage.includes("Duplicate entry")) {
                        console.log("Restaurant with same cuisine already exists");
                        res
                          .status(402)
                          .end("Restaurant with same cuisine already exists");
                      } else {
                        console.log(err);
                        res.writeHead(403, {
                          "Content-type": "text/plain"
                        });
                      }
                      res.end("Error in inserting items");
                    } else {
                      res.writeHead(200, {
                        "Content-type": "application/json"
                      });
                      console.log("Item details Inserted");
                      res.end(JSON.stringify(result3));
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });

  //edit item
app.post("/updateitem", (req, res) => {
    console.log("Inside update item details");
    if (req.session.userEmail) {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log("Error while creating connection");
        res.writeHead(500, {
          "Content-type": "text/plain"
        });
        res.end("Error while creating connection");
      } else {
        sql1 =
          "UPDATE items set " +
          "itemName =" +
          mysql.escape(req.body.itemName) +
          "," +
          "itemDesc = " +
          mysql.escape(req.body.itemDesc) +
          "," +
          "itemImage = " +
          mysql.escape(req.body.itemImage) +
          "," +
          "itemType = " +
          mysql.escape(req.body.itemType) +
          "," +
          "itemPrice = " +
          mysql.escape(req.body.itemPrice) +
          " WHERE itemId = " +
          mysql.escape(req.body.itemId);
        conn.query(sql1, function (err, result1) {
          if (err) {
            console.log("Error in updating item details");
            console.log(err);
            res.writeHead(400, {
              "Content-type": "text/plain"
            });
            console.log("err-----" + err);
            res.end("Error in updating item details");
          } else {
            console.log("Item details update complete!");
            res.writeHead(200, {
              "Content-type": "text/plain"
            });
            res.end("Item details update complete!");
          }
        });
      }
    });
    }
  });

  //Allsections
  app.get("/allsections", (req, res) => {
    console.log("Inside all sections");
    if (req.session.userEmail) {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log("Error while creating connection");
          res.writeHead(500, {
            "Content-type": "text/plain"
          });
          res.end("Error while creating connection");
        } else {
          const sql1 =
            "SELECT r.restId from restaurants r, users u WHERE u.userId = r.userId and u.userEmail = " +
            mysql.escape(req.session.userEmail) +
            "and u.accountType = " +
            2;
          conn.query(sql1, (err, result1) => {
            if (err) {
              console.log("Error in getting restaurant id");
              res.writeHead(400, {
                "Content-type": "text/plain"
              });
              res.end("Error in getting restaurant id");
            } else {
              const sql2 = "SELECT DISTINCT itemType from items where restId = "  + mysql.escape(result1[0].restId);
              conn.query(sql2, (err, result2) => {
                if (err) {
                  console.log("Error in getting all sections");
                  res.writeHead(400, {
                    "Content-type": "text/plain"
                  });
                  res.end("Error in getting all sections");
                } else {
                  res.writeHead(200, {
                    "Content-type": "application/json"
                  });
                  console.log(result2);
                  console.log("Displayed all sections");
                  res.end(JSON.stringify(result2));
                }
              });
            }
          });
        }
      });
    }
  });

  //AllItems
  app.get("/allItems", (req, res) => {
    console.log("Inside all items");
    if (req.session.userEmail) {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log("Error while creating connection");
          res.writeHead(500, {
            "Content-type": "text/plain"
          });
          res.end("Error while creating connection");
        } else {
          const sql1 =
            "SELECT r.restId from restaurants r, users u WHERE u.userId = r.userId and u.userEmail = " +
            mysql.escape(req.session.userEmail) +
            "and u.accountType = " +
            2;
          conn.query(sql1, (err, result1) => {
            if (err) {
              console.log("Error in getting restaurant id");
              res.writeHead(400, {
                "Content-type": "text/plain"
              });
              res.end("Error in getting restaurant id");
            } else {
              // const sql2 = "SELECT DISTINCT itemName from items where restId =  " + mysql.escape(result1[0].restId);
              const sql2 = "SELECT DISTINCT itemId, itemName, itemPrice, itemImage, itemDesc, itemType, cuisineName from items where restId =  " + mysql.escape(result1[0].restId);
              conn.query(sql2, (err, result2) => {
                if (err) {
                  console.log("Error in getting all items");
                  res.writeHead(400, {
                    "Content-type": "text/plain"
                  });
                  res.end("Error in getting all items");
                } else {
                  res.writeHead(200, {
                    "Content-type": "application/json"
                  });
                  console.log("Displayed all items");
                  res.end(JSON.stringify(result2));
                }
              });
            }
          });
        }
      });
    }
  });

//itemsBasedonSections
app.post("/itemsbasedonsections", (req, res) => {
    console.log("Inside items based on sections");
    if (req.session.userEmail) {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log("Error while creating connection");
          res.writeHead(500, {
            "Content-type": "text/plain"
          });
          res.end("Error while creating connection");
        } else {
          const sql1 =
            "SELECT r.restId from restaurants r, users u WHERE u.userId = r.userId and u.userEmail = " +
            mysql.escape(req.session.userEmail) +
            "and u.accountType = " +
            2;
          conn.query(sql1, (err, result1) => {
            if (err) {
              console.log("Error in getting restaurant id");
              res.writeHead(400, {
                "Content-type": "text/plain"
              });
              res.end("Error in getting restaurant id");
            } else {
              const sql2 = "SELECT * from items WHERE itemType =  " + mysql.escape(req.body.itemType) + "and restId = " +
                mysql.escape(result1[0].restId);
              conn.query(sql2, (err, result2) => {
                if (err) {
                  console.log("Error in getting items based on sections");
                  res.writeHead(400, {
                    "Content-type": "text/plain"
                  });
                  res.end("Error in getting items based on sections");
                } else {
                  res.writeHead(200, {
                    "Content-type": "application/json"
                  });
                  console.log("Displayed all items based on sections");
                  res.end(JSON.stringify(result2));
                }
              });
            }
          });
        }
      });
    }
  });

  //deleteItem
  app.put("/deleteitem", (req, res) => {
    console.log("Inside delete item details",req.body);
    if (req.session.userEmail) {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log("Error while creating connection");
          res.writeHead(500, {
            "Content-type": "text/plain"
          });
          res.end("Error while creating connection");
        } else {
          sql1 =
            "DELETE FROM items WHERE itemId = " + mysql.escape(req.body.itemId);
          conn.query(sql1, function (err, result1) {
            if (err) {
              console.log("Error in deleting item details");
              console.log(err);
              res.writeHead(400, {
                "Content-type": "text/plain"
              });
              console.log("err-----" + err);
              res.end("Error in deleting item details");
            } else {
              console.log("Item details deleted!");
              res.writeHead(200, {
                "Content-type": "text/plain"
              });
              res.end("Item details deleted!");
            }
          });
        }
      });
    }
  });

//update section
app.put("/updateSection", (req, res) => {
    console.log("Inside update section");
    if (req.session.userEmail) {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log("Error while creating connection");
          res.writeHead(500, {
            "Content-type": "text/plain"
          });
          res.end("Error while creating connection");
        } else {
          const sql1 =
            "SELECT r.restId from restaurants r, users u WHERE u.userId = r.userId and u.userEmail = " +
            mysql.escape(req.session.userEmail) +
            "and u.accountType = " +
            2;
          conn.query(sql1, (err, result1) => {
            if (err) {
              console.log("Error in getting restaurant id");
              res.writeHead(400, {
                "Content-type": "text/plain"
              });
              res.end("Error in getting restaurant id");
            } else {
              const sql2 =
                "UPDATE items set itemType = " +
                mysql.escape(req.body.itemType) +
                " WHERE restId = " +
                mysql.escape(result1[0].restId) + " AND itemType= "+mysql.escape(req.body.itemType1) ;
                console.log("sql2",sql2)
              conn.query(sql2, (err, result2) => {
                if (err) {
                  console.log("Error in updating sections");
                  res.writeHead(400, {
                    "Content-type": "text/plain"
                  });
                  res.end("Error in updating sections");
                } else {
                  res.writeHead(200, {
                    "Content-type": "application/json"
                  });
                  console.log("Section/s updated");
                  res.end("Section/s updated");
                }
              });
            }
          });
        }
      });
    }
  });

  //delete section
app.put("/deletesection", (req, res) => {
    console.log("Inside delete section");
    if (req.session.userEmail) {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log("Error while creating connection");
          res.writeHead(500, {
            "Content-type": "text/plain"
          });
          res.end("Error while creating connection");
        } else {
          const sql1 =
            "SELECT r.restId from restaurants r, users u WHERE u.userId = r.userId and u.userEmail = " +
            mysql.escape(req.session.userEmail) +
            "and u.accountType = " +
            2;
          conn.query(sql1, (err, result1) => {
            if (err) {
              console.log("Error in getting restaurant id");
              res.writeHead(400, {
                "Content-type": "text/plain"
              });
              res.end("Error in getting restaurant id");
            } else {
              const sql2 = "DELETE FROM items WHERE itemType = " + mysql.escape(req.body.itemType) + "and restId = " + mysql.escape(result1[0].restId);
              conn.query(sql2, (err, result2) => {
                if (err) {
                  console.log("Error in deleting sections");
                  res.writeHead(400, {
                    "Content-type": "text/plain"
                  });
                  res.end("Error in deleting sections");
                } else {
                  res.writeHead(200, {
                    "Content-type": "application/json"
                  });
                  console.log(result2.orderId);
                  console.log("Section/s deleted");
                  res.end("Section/s deleted");
                }
              });
            }
          });
        }
      });
    }
  });

module.exports = app;