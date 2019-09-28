const express = require('express');
var mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const pool = require('./ConnectionPooling');
const cors = require("cors");
// const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
//app.use(cors());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// setup session variable
app.use(session({
    secret: 'grubhub_app',
    resave: false,
    saveUninitialized: false,
    duration: 60 * 60 * 100,
    activeDuration: 5 * 60 * 100
}));

//Allow access control headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
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
    console.log(req.body);

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
            const sql = `SELECT * from users where userEmail= ${mysql.escape(req.body.userEmail)} 
            AND userPassword = ${mysql.escape(req.body.userPassword)}`;

            conn.query(sql, (err, result) => {
                if (err) {
                    res.writeHead(400, {
                        'Contnet-type': 'text/plain'
                    });
                    res.end("Invalid credentials");
                } else {
                    if (result.length == 0) {
                        res.writeHead(402, {
                            'Content-type': 'text/plain'
                        });
                        console.log("Invalid credentials");
                        res.end("Invalid credentials");
                    } else {
                        console.log(result);
                        res.cookie('cookie', result[0].userEmail, {
                            maxAge: 360000,
                            httpOnly: false,
                            path: '/'
                        });
                        //console.log("res.cookie",res.cookie);

                        req.session.userEmail = result[0].userEmail;
                        console.log("req.session.userEmail" + req.session.userEmail);
                        res.writeHead(200, {
                            'Content-type': 'text/plain'
                        });
                        res.end("Login successful");
                        console.log("Login successful");
                    }
                }
            });
        }
    });
});


//restaurentsbyItemName
app.post('/restaurantsbyItemName', (req, res) => {
    console.log("In restaurantsbyItemName");
    //console.log(req.body);
    console.log(req.session);

    // if (req.session.userEmail) {
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
    // }
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

    // if (req.session.user) {
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
                            res.end(JSON.stringify(result));
                        }
                    }
                });
            }
        });
    // }
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


app.listen(3001, () => {
    console.log('server is running on port 3001');
});