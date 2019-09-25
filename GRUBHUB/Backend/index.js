const express = require('express');
var mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const pool = require('./ConnectionPooling');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

var cors = require("cors");
app.use(cors());

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

//SignUp validation
app.post('/signup', (req, res) => {
    console.log("In signup POST");
    console.log("Request body: " + JSON.stringify(req.body));

    if (req.body.Accounttype == 1) {

        //query
        const sql1 = "INSERT into userdetails (UserName, UserEmail, UserPassword, UserPhone, UserAdr, UserZip, Accounttype) VALUES (" +
            mysql.escape(req.body.FullName) + "," +
            mysql.escape(req.body.Email) + "," +
            mysql.escape(req.body.Password) + "," +
            mysql.escape(req.body.PhoneNumber) + "," +
            mysql.escape(req.body.Address) + "," +
            mysql.escape(req.body.ZipCode) + "," +
            mysql.escape(req.body.Accounttype) +
            ");";

        pool.getConnection((err, conn) => {
            if (err) {
                console.log("Error in creating connection");
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                });
                res.end("Error in connecting connection");
            } else {
                conn.query(sql1, (err, result) => {
                    if (err) {
                        res.writeHead(400, {
                            'Content-type': 'text/plain'
                        });
                        console.log("Error in adding an user");
                        res.end("Error in adding an user");
                    } else {
                        console.log("result-----------" + result[0]);

                        res.writeHead(200, {
                            'Content-type': 'text/plain'
                        });
                        console.log("Signup successful");
                        res.end("Signup successful");
                    }
                });
            }
        });
    } else if (req.body.Accounttype == 2) {

        //query
        const sql1 = "INSERT into userdetails (UserName, UserEmail, UserPassword, UserPhone, UserAdr, UserZip, Accounttype) VALUES (" +
            mysql.escape(req.body.FullName) + "," +
            mysql.escape(req.body.Email) + "," +
            mysql.escape(req.body.Password) + "," +
            mysql.escape(req.body.PhoneNumber) + "," +
            mysql.escape(req.body.Address) + "," +
            mysql.escape(req.body.ZipCode) + "," +
            mysql.escape(req.body.Accounttype) +
            ");";

        const sql2 = "SELECT UserId FROM userdetails WHERE UserEmail = " + mysql.escape(req.body.Email) + ";";

        pool.getConnection((err, conn) => {
            if (err) {
                console.log("Error in creating connection");
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                });
                res.end("Error in connecting connection");
            } else {
                conn.query(sql1, (err, result) => {
                    if (err) {
                        console.log("Error in adding user");
                        res.end("Error in adding user");
                    } else {
                        conn.query(sql2, (err, result) => {
                            if (err) {
                                console.log("Error in getting User Id");
                                res.end("Error in getting User Id");
                            } else {
                                console.log(result[0])
                                const sql3 = "INSERT into restaurant (UserId, RestaurantName, RestaurantAdr, RestaurantZip, RestaurantPhone,RestaurantImage) VALUES ( " +
                                    result[0].UserId + "," +
                                    mysql.escape(req.body.RestName) + "," +
                                    mysql.escape(req.body.RestAdr) + "," +
                                    mysql.escape(req.body.RestZip) + "," +
                                    mysql.escape(req.body.RestPhone) + "," +
                                    mysql.escape(req.body.RestaurantImage) +
                                    ");";
                                conn.query(sql3, (err, result) => {
                                    if (err) {
                                        console.log(sql3 + "----------------------");
                                        res.end(err + "");
                                    } else {
                                        res.send("Successfully added an user");
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

//Login validation
app.post('/login', (req, res) => {
    console.log("In login post");
    console.log(req.body)

    //connection
    pool.getConnection((err, conn) => {
        if (err) {
            console.log("Error while connecting to Database");
            res.writeHead(400, {
                'Content-type': 'text/plain'
            });
            res.end("Error while connecting to Database!");
        } else {

            //query
            const sql = `SELECT * from userdetails where UserEmail= ${mysql.escape(req.body.Email)} 
                        AND UserPassword = ${mysql.escape(req.body.Password)}`;
            conn.query(sql, (err, result) => {
                if (err) {
                    res.writeHead(400, {
                        'Content-type': 'text/plain'
                    });
                    res.end("Invalid Credentials");
                } else {
                    if (result.length == 0) {
                        res.writeHead(402, {
                            'Content-type': 'text/plain'
                        });
                        console.log("Invalid credentials");
                        res.end("Invalid credentials");
                    } else {

                        console.log(result);
                        res.cookie('cookie', result[0].UserName, {
                            maxAge: 360000,
                            httpOnly: false,
                            path: '/'
                        });
                        console.log("res.cookie", res.cookie)

                        req.session.UserName = result[0].UserName
                        console.log("req.session.username", req.session.UserName)
                        // console.log("req.session.UserName",req.session.UserName)
                        // res.cookie('Accounttype', result[0].Accounttype, {
                        //     maxAge: 360000,
                        //     httpOnly: false,
                        //     path: '/'
                        // });
                        // req.session.UserName = result[0].UserName;
                        // res.writeHead(200,{
                        //     'Content-type': 'text/plain'
                        // });
                        // console.log("Login successful",req.session.user);
                        // res.status(200)
                        // res.send(result[0])
                        res.writeHead(200, {
                            'Content-type': 'text/plain'
                        });
                        res.end("Login successful");
                    }
                }
            });
        }
    });
});

//get profile details
app.post('/get-profile', (req, res) => {
    console.log("Inside get profile");
    console.log("req.body", (req.body));
    if (req.body.UserEmail) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log("Error while creating connection");
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                });
                res.end("Error while creating connection");
            } else {
                //query
                console.log("mysql.escape(req.body.UserEmail)" + mysql.escape(req.body.UserEmail));
                const sql1 = "SELECT UserId, UserName, UserEmail, UserPhone, UserAdr, UserZip FROM userdetails WHERE UserEmail= " + mysql.escape(req.body.UserEmail);
                // const sql2 = "SELECT RestaurantName, RestaurantAdr, RestaurantZip, RestaurantPhone FROM restaurant WHERE UserName= "+mysql.escape(req.body.UserName);

                conn.query(sql1, (err, result) => {
                    if (err) {
                        console.log("Error in retrieving profile data");
                        res.writeHead(400, {
                            'Content-type': 'text/plain'
                        });
                        res.end("Error in retrieving profile data");
                    } else {
                        console.log("Profile data: ", result);
                        const sql2 = "SELECT RestaurantName, RestaurantAdr, RestaurantZip, RestaurantPhone FROM restaurant WHERE UserId= " + mysql.escape(result[0].UserId);
                        conn.query(sql2, (err, result1) => {
                            if (err) {
                                console.log("Error while getting restaurent details");
                                // res.writeHead(400,{
                                //     'Content-type': 'text/plain'
                                // });
                                // res.end("Error while getting restaurent details");
                            }
                            // else{
                            console.log(result1);
                            if (result1 && result1.length != 0) {
                                const obj = result.concat(result1);
                                console.log("--obj--" + obj);
                                res.end(JSON.stringify(obj));

                            } else {
                                res.writeHead(200, {
                                    'Content-type': 'application/json'
                                });
                                res.end(JSON.stringify(result));
                            }
                        });
                    }
                });
            }
        })
    }
});

//put profile
app.put('/update-profile', (req, res) => {
    console.log("Inside update profile");
    console.log("req.session.user" + req.session.user);
    if (req.body.UserEmail) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log("Error while creating connection");
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                });
                res.end("Error while creating connection");
            } else {
                const sql1 =
                    "SELECT Accounttype FROM userdetails WHERE UserEmail = " +
                    mysql.escape(req.body.UserEmail);
                console.log("sql1---" + sql1);
                conn.query(sql1, (err, result) => {
                    if (err) {
                        console.log("Error in retrieving profile data");
                        res.writeHead(400, {
                            'Content-type': 'text/plain'
                        });
                        res.end("Error in updating profile data");
                    } else {
                        console.log("result----->" + result);
                        const sql2 =
                            "SELECT UserId from userDetails WHERE UserEmail = " +
                            mysql.escape(req.body.UserEmail);
                        console.log("sql2---" + sql2);
                        conn.query(sql2, (err, result2) => {
                            if (err) {
                                console.log("Error in fetching User Id");
                                console.log(err);
                            } else {
                                console.log("User Id fetched");
                                console.log(result[0]);
                                console.log(result2[0]);
                                if (result[0].Accounttype == 1) {
                                    var sql3 =
                                        "UPDATE userDetails set " +
                                        "UserName = " +
                                        mysql.escape(req.body.UserName) +
                                        "," +
                                        "UserPhone = " +
                                        mysql.escape(req.body.UserPhone) +
                                        "," +
                                        "UserAdr = " +
                                        mysql.escape(req.body.UserAdr) +
                                        "," +
                                        "UserZip= " +
                                        mysql.escape(req.body.UserZip) +
                                        " WHERE UserId = " +
                                        result2[0].UserId;
                                    console.log("sql3---" + sql3);
                                } else if (result[0].Accounttype == 2) {
                                    var sql3 =
                                        "UPDATE userdetails u JOIN restaurant r ON u.UserId = r.UserId SET " +
                                        "u.UserName = " +
                                        mysql.escape(req.body.UserName) +
                                        "," +
                                        "u.UserPhone = " +
                                        mysql.escape(req.body.UserPhone) +
                                        "," +
                                        "u.UserAdr = " +
                                        mysql.escape(req.body.UserAdr) +
                                        "," +
                                        "u.UserZip = " +
                                        mysql.escape(req.body.UserZip) +
                                        "," +
                                        "r.RestaurantName = " +
                                        mysql.escape(req.body.RestaurantName) +
                                        "," +
                                        "r.RestaurantAdr = " +
                                        mysql.escape(req.body.RestaurantAdr) +
                                        "," +
                                        "r.RestaurantZip = " +
                                        mysql.escape(req.body.RestaurantZip) +
                                        "," +
                                        "r.RestaurantPhone = " +
                                        mysql.escape(req.body.RestaurantPhone) +
                                        " WHERE u.UserId = " +
                                        result2[0].UserId;
                                    console.log("sql3------" + sql3);
                                }
                                conn.query(sql3, function (err, result3) {
                                    if (err) {
                                        console.log("Error in updating profile data");
                                        console.log(err);
                                        res.writeHead(400, {
                                            "Content-type": "text/plain"
                                        });
                                        console.log("err-----" + err);
                                        res.end("Error in updating profile data");
                                    } else {
                                        console.log("Profile data update complete!");
                                        res.writeHead(200, {
                                            "Content-type": "text/plain"
                                        });
                                        res.end("Profile data update complete!");
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


app.listen(3001, () => {
    console.log('server is running on port 3001');
});