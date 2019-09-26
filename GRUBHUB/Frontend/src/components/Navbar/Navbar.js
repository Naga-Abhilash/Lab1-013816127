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
                <ul className="nav navbar-nav navbar-right">
                    <li><Link to="/login" onClick={this.handleLogout}><span className="glyphicon glyphicon-user"></span>Logout</Link></li>
                </ul>
            );
        } else {
            //Else display login button
            console.log("Not Able to read cookie");
            navLogin = (
                <ul className="nav navbar-nav navbar-right">
                    <li><Link to="/login"><span className="glyphicon glyphicon-log-in"></span> Login</Link></li>
                </ul>
            )
        }

        return (
           
            <div>
                <nav className="navbar navbar-inverse">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <Link to="/login" > <h1 className="text-danger"> GRUBHUB</h1></Link>
                        </div>
                        {navLogin}
                    </div>
                </nav>
            </div>
        )
    }
}

export default Navbar;
