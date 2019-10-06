const express = require('express');
const pool = require('../configFiles/connectionPooling');
var mysql = require('mysql');
const app = express.Router();

//login
app.post('/login', (req,res)=>{
    console.log("In login post");
    console.log(req.body);

    //connection
    pool.getConnection((err,conn)=>{
        if(err){
            console.log("Error while connecting to database");
            res.writeHead(500,{
                'Content-type': 'text/plain'
            });
            res.end("Error while connecting to database");
        }else{
            
            //query
            const sql = `SELECT * from users where userEmail= ${mysql.escape(req.body.userEmail)} 
            AND userPassword = ${mysql.escape(req.body.userPassword)}`;
            console.log(sql);
            

            conn.query(sql, (err,result)=>{
                if(err){
                    res.writeHead(400,{
                        'Contnet-type': 'text/plain'
                    });
                    res.end("Invalid credentials");
                }else{
                    if(result.length == 0){//|| !bcrypt.compareSync(req.body.userPassword, result[0].userPassword))
                        res.writeHead(402, {
                            'Content-type': 'text/plain'
                        });
                        console.log("Invalid credentials");
                        res.end("Invalid credentials");
                    }else{
                        console.log(result);
                        localStorage.setItem('userEmail', result[0].userEmail)
                        console.log("local Storage: ", localStorage.getItem('userEmail'));

                        res.cookie('cookie',result[0].userEmail,{
                            maxAge: 360000,
                            httpOnly: false,
                            path: '/'
                        });
                        //console.log("res.cookie",res.cookie);

                        req.session.userEmail = result[0].userEmail;
                        console.log("req.session.userEmail"+req.session.userEmail);
                        res.writeHead(200, {
                            'Content-type': 'text/plain'
                        });
                        // res.send(result[0].accountType)
                        res.end(JSON.stringify(result[0]));
                        console.log("Login successful");
                    }
                }
            });
        }
    });
});

module.exports = app;