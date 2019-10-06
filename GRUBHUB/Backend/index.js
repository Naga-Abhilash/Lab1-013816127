const express = require('express');
var mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const pool = require('./configFiles/connectionPooling');
const cors = require("cors");
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const login = require('./routes/login');
const signUp = require('./routes/signUp');
const profile = require('./routes/profile');
const restaurants = require('./routes/restaurants');
const orders = require('./routes/orders');
const cart = require('./routes/cart');
const logout = require('./routes/logout');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
//app.use(cors());
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./local');

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
app.use( (req,res,next) =>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials','true');
    res.setHeader('Access-Control-Allow-Methods','GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control','no-cache');
    next();
});

//Signup
app.use('/',signUp);

//Login
app.use('/',login);

//profile
app.use('/profile',profile);

//restaurents
app.use('/restaurant',restaurants);

//orders
app.use('/orders',orders);

//cart
app.use('/cart',cart);

//logout
app.use('/',logout);



//UpcomingOrders
app.get("/upcomingOrders", (req, res) => {
    console.log("Inside upcoming orders");
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
            `SELECT r.restId from restaurants r, users u WHERE u.userId = r.userId and u.userEmail = ${mysql.escape(req.session.userEmail)}
            AND u.accountType = 2`;
          conn.query(sql1, (err, result1) => {
            if (err) {
              console.log("Error in getting restaurant id");
              res.writeHead(400, {
                "Content-type": "text/plain"
              });
              res.end("Error in getting restaurant id");
            } else {
                console.log(result1);
              const sql2 = "SELECT * FROM orders where orderStatus NOT IN ('cancelled','delivered') and restId = " + mysql.escape(result1[0].restId);
              conn.query(sql2, (err, result2) => {
                if (err) {
                  console.log("Error in getting upcoming orders");
                  res.writeHead(400, {
                    "Content-type": "text/plain"
                  });
                  res.end("Error in getting upcoming orders");
                } else {
                  res.writeHead(200, {
                    "Content-type": "application/json"
                  });
                  console.log("retrived upcoming orders");
                  
                  let lookUp = {};
                  let uniqueOrders = [];
                  for(let item,j=0; item = result2[j++];){
                    let orderIdTemp = item.orderId;

                    if(!(orderIdTemp in lookUp)){
                        lookUp[orderIdTemp] = 1;
                        uniqueOrders.push(orderIdTemp);
                    }
                  }
                  console.log(uniqueOrders);

                let finalOrders = [];
                let temp = [];
                for(let k=0;k<uniqueOrders.length;k++){
                    for(let l=0;l<result2.length;l++){
                        
                        if(uniqueOrders[k] === result2[l].orderId){
                            temp.push(result2[l]);
                        }
                    }
                    if(!temp.length==0){
                        finalOrders.push({
                            orderId : uniqueOrders[k],
                            userOrder : temp
                        }); 
                        temp =[];
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

app.listen(3001, ()=>{
    console.log('server is running on port 3001');
});