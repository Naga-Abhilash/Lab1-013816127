import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom'

var redirecter = null;
class Navbar extends Component {

    constructor() {
        super();

        //bind
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout = () => {
        
        localStorage.removeItem("email");
        redirecter = <Redirect to = "/login"></Redirect>
    }

    render() {
        
        let navLogin = null;
        if (localStorage.getItem('email')) {
            console.log("Able to read local storage");
            navLogin = (
                <ul class="nav navbar-nav navbar-right">
                    <li><Link to="/login" onClick={this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li>
                </ul>
            );
        } else {
            //Else display login button
            console.log("Not Able to read cookie");
            navLogin = (
                <ul class="nav navbar-nav navbar-right">
                    <li><Link to="/login"><span class="glyphicon glyphicon-log-in"></span> Login</Link></li>
                </ul>
            )
        }

        return (
            <div>
            <div className="container header-container">
                <div className="header-bar" >
                    <span>
                        <h1>GRUBHUB</h1>
                        {navLogin}
                    </span>
                </div>
            </div>
            </div>
        )
    }
}

export default Navbar;
