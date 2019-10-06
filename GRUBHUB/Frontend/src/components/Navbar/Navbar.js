import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom'
import './navStyles.css'

var redirecter = null;
class Navbar extends Component {

    constructor() {
        super();

        //bind
        this.handleLogout = this.handleLogout.bind(this);
    }
    componentDidMount = () =>{
        
    }
    handleLogout = (e) => {
        //  e.preventDefault();
        localStorage.removeItem("email");
        // redirecter = <Redirect to = "/login"/>
    }

    render() {

        let navLogin = null;
        if (cookie.load('cookie')) {
            console.log("Able to read local storage");
            navLogin = (
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link" href="/">Home </a>
                        </li>
                        <li className="nav-item active">
                            <a className="nav-link" href="/profile">Your Profile </a>
                        </li>
                        <li className="nav-item dropdown active">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-target = "dropdown-target">
                                Orders
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <a className="dropdown-item" href="/upcomingorders">Upcoming Orders</a>
                                <a className="dropdown-item" href="/pastorders">Past Orders</a>
                            </div>
                        </li>
                        <li className="nav-item active">
                            <a className="nav-link" href="/cart">Cart<span className="badge badge-danger">9</span> </a>
                        </li>

                    </ul>
                    <div className="nav-login-logout">
                        <ul className="nav ">
                            <li><Link to="/login" onClick={this.handleLogout}> <strong>Logout</strong></Link></li>
                        </ul>
                    </div>
                </div>
            );
        } else {
            //Else display login button
            console.log("Not Able to read cookie");
            navLogin = null
        }

        return (

            <div>
                {redirecter}
                <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
                    <a className="navbar-brand" href="/" ><h2 className="logo-main font-weight-bold"> GRUBHUB</h2></a>
                    {navLogin}
                </nav>
            </div>
        )
    }
}

export default Navbar;
