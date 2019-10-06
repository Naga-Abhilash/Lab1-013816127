const express = require('express');
var mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const pool = require('./ConnectionPooling');
const cors = require("cors");
var MySQLStore = require('express-mysql-session')(session);
// const bcrypt = require('bcrypt');

// if (typeof localStorage === "undefined" || localStorage === null) {
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./local');
// }  
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(cors());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// setup session variable

var options = {
    // connectionLimit: 100,
    port: 3306,
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'grubhub'
};
var sessionStore = new MySQLStore(options);
const two_hours = 1000 * 60 * 60 * 2
app.use(session({
    secret: 'grubhub_app',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: two_hours,
        secure: false
    }
    // duration: 60 * 60 * 100,
    // activeDuration: 5 * 60 * 100
}));
//Allow access control headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//CustomerSignup
app.post('/customerSignup', (req, res) => {
    console.log("In customer signup");
    console.log(req.body);

    //query
    const sql1 = "INSERT into users (userName, userEmail, userPassword, userPhone, userAddress, userZip, accountType) VALUES (" +
        mysql.escape(req.body.userName) + "," +
        mysql.escape(req.body.userEmail) + "," +
        mysql.escape(req.body.userPassword) + "," +
        mysql.escape(req.body.userPhone) + "," +
        mysql.escape(req.body.userAddress) + "," +
        mysql.escape(req.body.userZip) + "," +
        mysql.escape(req.body.accountType) +
        ");";

    pool.getConnection((err, conn) => {
        if (err) {
            console.log("Error in creating connection");
            res.writeHead(500, {
                'Content-type': 'text/plain'
            });
            res.end("Error in connecting connection");
        } else {
            conn.query(sql1, (err, result) => {
                if (err) {
                    res.writeHead(400, {
                        'Content-type': 'text/plain'
                    });
                    console.log(err);
                    if (err.sqlMessage.includes("userEmail")) {
                        console.log("Use different email");
                        res.status(401).end("Use different email");
                    } else {
                        console.log(err);
                        res.end(err + "");
                    }

                } else {
                    res.writeHead(200, {
                        'Content-type': 'text/plain'
                    });
                    console.log("Signup successful");
                    res.end("Signup successful");
                }
            });
        }
    });
});

//OwnerSignup
app.post('/ownerSignup', (req, res) => {
    console.log("In owners signup");
    console.log(req.body);

    const sql1 = `SELECT restName, restZip FROM restaurants WHERE restName = ${mysql.escape(req.body.restName)}
                AND restZip = ${mysql.escape(req.body.restZip)}`
    console.log(sql1);
    pool.getConnection((err, conn) => {
        if (err) {
            console.log("Error in creating connection");
            res.writeHead(500, {
                'Content-type': 'text/plain'
            });
            res.end("Error in connecting connection");
        } else {
            conn.query(sql1, (err, result) => {
                if (err) {
                    res.writeHead(400, {
                        'Content-type': 'text/plain'
                    });
                    console.log(err);
                    res.end("Enter valid details");
                } else {
                    if (!result.length == 0) {
                        console.log("Duplicate Restaurant name within same location");
                        res.status(401).end("Duplicate Restaurant name within same location");
                    } else {
                        //
                        console.log("New Restaurant");
                        const sql2 = "INSERT into users (userName, userEmail, userPassword, userPhone, userAddress, userZip, accountType) VALUES (" +
                            mysql.escape(req.body.userName) + "," +
                            mysql.escape(req.body.userEmail) + "," +
                            mysql.escape(req.body.userPassword) + "," +
                            mysql.escape(req.body.userPhone) + "," +
                            mysql.escape(req.body.userAddress) + "," +
                            mysql.escape(req.body.userZip) + "," +
                            mysql.escape(req.body.accountType) +
                            ");";
                        pool.getConnection((err, conn) => {
                            if (err) {
                                console.log("Error in creating connection");
                                res.writeHead(500, {
                                    'Content-type': 'text/plain'
                                });
                                res.end("Error in connecting connection");
                            } else {
                                conn.query(sql2, (err, result) => {
                                    if (err) {
                                        res.writeHead(400, {
                                            'Content-type': 'text/plain'
                                        });
                                        console.log(err);
                                        if (err.sqlMessage.includes("userEmail")) {
                                            console.log("Use different email");
                                            res.status(402).end("Use different email");
                                        } else {
                                            console.log(err);

                                            res.status(403).end("Please Enter Valid details");
                                        }
                                    } else {
                                        console.log("Getting userId");

                                        const sql3 = `SELECT userId FROM users WHERE userEmail = ${mysql.escape(req.body.userEmail)}`;

                                        pool.getConnection((err, conn) => {
                                            if (err) {
                                                console.log("Error in creating connection");
                                                res.writeHead(500, {
                                                    'Content-type': 'text/plain'
                                                });
                                                res.end("Error in connecting connection");
                                            } else {
                                                conn.query(sql3, (err, result) => {
                                                    if (err) {
                                                        res.status(404).end("UserId not created");
                                                    } else {
                                                        console.log(result);
                                                        console.log("userId created");

                                                        const sql4 = "INSERT into restaurants (userId, restName, restAddress, restZip, restPhone) VALUES ( " +
                                                            result[0].userId + "," +
                                                            mysql.escape(req.body.restName) + "," +
                                                            mysql.escape(req.body.restAddress) + "," +
                                                            mysql.escape(req.body.restZip) + "," +
                                                            mysql.escape(req.body.restPhone) +
                                                            ");";

                                                        console.log(sql4);
                                                        pool.getConnection((err, conn) => {
                                                            if (err) {
                                                                console.log(err);
                                                                res.status(500).end("Error in creating connection");
                                                            } else {
                                                                conn.query(sql4, (err, result) => {
                                                                    if (err) {
                                                                        console.log(err);
                                                                        res.status(405).end("Enter valid restaurant details");
                                                                    } else {
                                                                        res.writeHead(200, {
                                                                            'Content-type': 'text/plain'
                                                                        });
                                                                        console.log("Signup successful");
                                                                        res.end("Signup successful");
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
                            }
                        });
                    }
                }
            });
        }
    });


});


//Login
app.post('/login', (req, res) => {
    console.log("In login post");
    console.log("request", req.body);

    //connection
    pool.getConnection((err, conn) => {
        if (err) {
            console.log("Error while connecting to database");
            res.writeHead(500, {
                'Content-type': 'text/plain'
            });
            res.end("Error while connecting to database");
        } else {

            //query
            // const sql = `SELECT * from users where userEmail= ${mysql.escape(req.body.userEmail)} +
            //  and userPassword=${mysql.escape(req.body.userPassword)}`;

            const sql = `SELECT * from users where userEmail= ${mysql.escape(req.body.userEmail)} 
            AND userPassword = ${mysql.escape(req.body.userPassword)}`;


            conn.query(sql, (err, result) => {
                if (err) {
                    res.writeHead(400, {
                        'Contnet-type': 'text/plain'
                    });
                    console.log(err);
                    res.end("Invalid credentials");
                } else {
                    if (result.length == 0) //|| !bcrypt.compareSync(req.body.userPassword, result[0].userPassword)){
                    {
                        res.writeHead(402, {
                            'Content-type': 'text/plain'
                        });
                        console.log("Invalid credentials", result);
                        res.end("Invalid credentials");
                    } else {
                        console.log(result);
                        res.cookie('cookie', result[0].userEmail, {
                            maxAge: 360000,
                            httpOnly: false,
                            path: '/'
                        });
                        console.log("res.cookie", res.cookie);
                        localStorage.setItem('userEmail', result[0].userEmail)
                        console.log("local Storage: ", localStorage.getItem('userEmail'));

                        req.session.user = result;
                        console.log("Session data: ", req.session);
                        res.writeHead(200, {
                            'Content-type': 'text/plain'
                        });
                        // res.send(result[0].accountType)
                        res.end(JSON.stringify(result[0].accountType));
                        console.log("Login successful");
                    }
                }
            });
        }
    });
})


//restaurentsbyItemName
app.post('/restaurantsbyItemName', (req, res) => {
    console.log("In restaurantsbyItemName");
    console.log(req.body);
    console.log(req.session.userEmail);

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
                const sql = `SELECT DISTINCT r.restName, r.restId, r.restImage, r.restDesc, r.restAddress,
                        i.cuisineId, i.cuisineImage, i.cuisineName FROM restaurants r, items i
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

//AllCuisines
app.get('/getCuisines', (req, res) => {
    console.log("In getCuisines");

    if (req.session.user) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log("Error while connecting to database");
                res.writeHead(500, {
                    'Content-type': 'text/plain'
                });
                res.end("Error while connecting to database");
            } else {
                //query
                const sql = `SELECT DISTINCT cuisineName, cuisineImage FROM items`;
                //console.log(sql);
                conn.query(sql, (err, result) => {
                    if (err) {
                        res.writeHead(400, {
                            'Content-type': 'text/plain'
                        });
                        res.end("Couldnt get cuisine names");
                    } else {
                        if (result.length == 0) {
                            res.writeHead(401, {
                                'Content-type': 'text/plain'
                            });
                            res.end("Sorry, No cuisines found");
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
                const sql = `SELECT DISTINCT r.restName, r.restId, r.restImage, r.restDesc, r.restAddress,
                        i.cuisineId, i.cuisineImage, i.cuisineName FROM restaurants r, items i
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

app.get('/allrestaurants', (req, res) => {
    console.log("In allrestaurants GET");

    if (req.session.user) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log("Error while connecting to database");
                res.writeHead(500, {
                    'Content-type': 'text/plain'
                });
                res.end("Error while connecting to database");
            } else {
                //query
                const sql = `SELECT * FROM restaurants`;

                conn.query(sql, (err, result) => {
                    if (err) {
                        res.writeHead(400, {
                            'Content-type': 'text/plain'
                        });
                        res.end("Couldnt get cuisine names");
                    } else {
                        if (result.length == 0) {
                            res.writeHead(401, {
                                'Content-type': 'text/plain'
                            });
                            res.end("Sorry, No restaurants found");
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

//Get items by restaurant
app.post('/itemsByRestaurant', (req, res) => {
    console.log("In itemsByRestaurant");
    console.log(req.body.restId);
    console.log(localStorage.getItem('userEmail'));
    console.log(req.session.userEmail);


    // if (localStorage.getItem('userEmail')) {
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
                    // console.log(result);
                    res.writeHead(200, {
                        'Content-type': 'text/plain'
                    });
                    res.end(JSON.stringify(result));
                }
            });

        }

    });
    // }
})



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


//postOrder
app.post('/orderItems', (req, res) => {
    console.log("In orderItems");
    console.log(req);
    var max = 0;
    if (localStorage.getItem('userEmail')) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log(err);
                res.status(500).end("Error while connecting to database");
            } else {
                //query
                const sql = `SELECT max(orderId) as max from orders`;
                console.log(sql);

                conn.query(sql, (err, result) => {
                    if (err) {
                        res.status(500).end("Cant get orders details");
                    } else {
                        console.log(result);
                        max = result[0].max;

                        const sql1 = `SELECT * FROM cart WHERE userEmail= ${mysql.escape(localStorage.getItem('userEmail'))}`;

                        console.log(sql1);
                        conn.query(sql1, (err, result) => {
                            if (err) {
                                res.status(500).end("Cant get cart details");
                            } else {
                                for (var i = 0; i < result.length; i++) {
                                    const sql1 = `INSERT INTO orders (orderId,restId,userEmail, itemId, itemName,
                                        itemQuantity, itemPrice, itemTotal, orderStatus, Date) VALUES 
                                        (${max + 1}, ${result[i].restId}, ${mysql.escape(result[i].userEmail)},
                                        ${result[i].itemId}, ${mysql.escape(result[i].itemName)}, ${result[i].itemQuantity},
                                        ${result[i].itemPrice}, ${result[i].itemTotal}, "New", ${mysql.escape(new Date())})`;

                                    console.log(sql1);
                                    conn.query(sql1, (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            res.status(400).end("Please try again to order items");
                                        } else {
                                            console.log(result);
                                            const sql2 = `DELETE FROM cart WHERE userEmail=${mysql.escape(localStorage.getItem('userEmail'))}`;
                                            console.log(sql2);
                                            conn.query(sql2, (err, result) => {
                                                if (err) {
                                                    console.log(err);
                                                    res.status(400).end("Please try again to order items");
                                                } else {
                                                    res.status(200).end("Order placed");
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });
    }
});


const cartitems = [{ "userEmail": "user8@gmail.com", "itemId": 7, "restId": 2, "itemName": "Brunch Torte", "itemPrice": 10, "itemImage": "", "itemQuantity": 1, "itemTotal": 10 }, { "userEmail": "user8@gmail.com", "itemId": 8, "restId": 2, "itemName": "Baked Eggs and Sausage", "itemPrice": 12, "itemImage": "", "itemQuantity": 2, "itemTotal": 24 }, { "userEmail": "user8@gmail.com", "itemId": 9, "restId": 2, "itemName": "Fiorentina Steak", "itemPrice": 15, "itemImage": "", "itemQuantity": 3, "itemTotal": 45 }]


// app.post('/showCart', (req, res) => {
//     console.log("in show cart");
//     res.writeHead(200, {
//         'Content-type': 'text/plain'
//     });
//     res.end(JSON.stringify(cartitems));
// })

// AllCart
app.post('/showCart', (req, res) => {
    console.log("In show cart");
    console.log(req.session);
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
                        // console.log(result);
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
//previous orders


const previousorders = [

    [
        { "orderId": 1, "userEmail": "user7@gmail.com", "userName": "user7", "userAddress": "101 san Fernando", "itemId": 1, "itemName": "Chicken Biryani", "itemQuantity": 2, "itemPrice": 12, "itemTotal": 24 },
        { "orderId": 1, "userEmail": "user7@gmail.com", "userName": "user7", "userAddress": "101 san Fernando", "itemId": 3, "itemName": "Chicken legs", "itemQuantity": 4, "itemPrice": 8, "itemTotal": 32 },
        { "orderId": 1, "userEmail": "user7@gmail.com", "userName": "user7", "userAddress": "101 san Fernando", "itemId": 5, "itemName": "paneer butter masala", "itemQuantity": 1, "itemPrice": 10, "itemTotal": 10 }
    ],
    [
        { "orderId": 2, "userEmail": "user7@gmail.com", "userName": "user7", "userAddress": "101 san Fernando", "itemId": 12, "itemName": "sausage", "itemQuantity": 6, "itemPrice": 10, "itemTotal": 60 },
        { "orderId": 2, "userEmail": "user7@gmail.com", "userName": "user7", "userAddress": "101 san Fernando", "itemId": 13, "itemName": "Bacon and cheese burger", "itemQuantity": 2, "itemPrice": 15, "itemTotal": 30 }
    ]

]

// app.post('/previousOrders', (req, res) => {
//     console.log("in previous orders");
//     console.log(previousorders);

//     res.writeHead(200, {
//         'Content-type': 'text/plain'
//     });
//     res.end(JSON.stringify(previousorders));
// })

// getpreviousorders
app.post('/previousOrders', (req, res) => {
    console.log("In previous orders");
    console.log(req.body);
    if (localStorage.getItem('userEmail')) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log(err);
                res.status(500).end("Error while connecting to database");
            } else {
                //query
                const sql = `SELECT * FROM orders WHERE userEmail=${mysql.escape(localStorage.getItem('userEmail'))} AND
                            orderStatus= "delivered"`;
                console.log(sql);

                conn.query(sql, (err, result) => {
                    if (err) {
                        res.status(500).end("Cant get orders details");
                    } else {
                        console.log(result);

                        let lookUp = {};
                        let uniqueOrders = [];
                        for (let item, j = 0; item = result[j++];) {
                            let orderIdTemp = item.orderId;

                            if (!(orderIdTemp in lookUp)) {
                                lookUp[orderIdTemp] = 1;
                                uniqueOrders.push(orderIdTemp);
                            }
                        }
                        console.log(uniqueOrders);

                        let finalOrders = [];
                        let temp = [];
                        for (let k = 0; k < uniqueOrders.length; k++) {
                            for (let l = 0; l < result.length; l++) {
                                if (uniqueOrders[k] === result[l].orderId) {
                                    temp.push(result[l]);
                                }
                            }
                            if (!temp.length == 0) {
                                finalOrders.push({
                                    orderId: uniqueOrders[k],
                                    userOrder: temp
                                });
                                temp = [];
                            }
                        }
                        console.log(JSON.stringify(finalOrders));
                        res.writeHead(200, {
                            'Content-type': 'application/json'
                        });
                        res.end(JSON.stringify(finalOrders));
                    }
                });
            }
        });
    }
});

//UpcomingOrders
app.get("/upcomingOrders", (req, res) => {
    console.log("Inside upcoming orders");
    if (localStorage.getItem('userEmail')) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log("Error while creating connection");
                res.writeHead(500, {
                    "Content-type": "text/plain"
                });
                res.end("Error while creating connection");
            } else {
                const sql1 =
                    `SELECT o.restId from orders o, users u WHERE u.userEmail = o.userEmail and u.userEmail = ${mysql.escape(localStorage.getItem('userEmail'))}
            AND u.accountType = 1`;
                console.log(sql1);

                conn.query(sql1, (err, result1) => {
                    if (err) {
                        console.log("Error in getting restaurant id");
                        res.writeHead(400, {
                            "Content-type": "text/plain"
                        });
                        res.end("Error in getting restaurant id");
                    } else {
                        console.log(result1);
                        const sql2 = `SELECT * FROM orders where orderStatus NOT IN ('cancelled','delivered') and restId IN (SELECT o.restId from orders o, users u WHERE u.userEmail = o.userEmail and u.userEmail = ${mysql.escape(localStorage.getItem('userEmail'))}
                        AND u.accountType = 1) order by orderId DESC`;
                        conn.query(sql2, (err, result2) => {
                            if (err) {
                                console.log("Error in getting upcoming orders");
                                res.writeHead(400, {
                                    "Content-type": "text/plain"
                                });
                                res.end("Error in getting upcoming orders");
                            } else {
                                console.log("sql2", sql2);
                                res.writeHead(200, {
                                    "Content-type": "application/json"
                                });
                                console.log("retrived upcoming orders", result2);

                                let lookUp = {};
                                let uniqueOrders = [];
                                for (let item, j = 0; item = result2[j++];) {
                                    let orderIdTemp = item.orderId;

                                    if (!(orderIdTemp in lookUp)) {
                                        lookUp[orderIdTemp] = 1;
                                        uniqueOrders.push(orderIdTemp);
                                    }
                                }
                                console.log(uniqueOrders);

                                let finalOrders = [];
                                let temp = [];
                                for (let k = 0; k < uniqueOrders.length; k++) {
                                    for (let l = 0; l < result2.length; l++) {

                                        if (uniqueOrders[k] === result2[l].orderId) {
                                            temp.push(result2[l]);
                                        }
                                    }
                                    if (!temp.length == 0) {
                                        finalOrders.push({
                                            orderId: uniqueOrders[k],
                                            userOrder: temp
                                        });
                                        temp = [];
                                    }

                                }
                                console.log(JSON.stringify(finalOrders));
                                res.end(JSON.stringify(finalOrders));

                            }
                        });
                    }
                });
            }
        });
    }
});

//put restaurant details
app.put("/updaterestdetails", (req, res) => {
    console.log("Inside update profile");

    if (req.body.userEmail) {
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
                    mysql.escape(req.body.userEmail);
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
                            "restZip = " +
                            mysql.escape(req.body.restZip) +
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

app.listen(3001, () => {
    console.log('server is running on port 3001');
});