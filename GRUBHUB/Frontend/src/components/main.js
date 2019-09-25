import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import Home from './home/home'
import Login from './Login/login'
import Signup from './Signup/Signup'
import Profile from './Update/Profile' ;

class Main extends Component {

    render() {
        return (
            <div>
               
                    <div>
                        <Route exact path="/" component={Home} />
                        <Route path="/login" component={Login} />
                        <Route path="/home" component={Login} />
                        <Route path="/signup" component={Signup} />
                        <Route path="/profile" component={Profile} />
                    </div>
            </div>
        );
    }
    
}

export default Main;