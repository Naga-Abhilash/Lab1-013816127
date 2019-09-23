import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import Home from './home/home'
import OwnerSignup from '../components/Signup/OwnerSignup'
import Login from './Login/login'
import UserSignup from '../components/Signup/UserSignup'
import { Provider } from 'react-redux'
import store from '../store/store'
import UpdateProfile from './Update/UpdateProfile' ;

class Main extends Component {

    render() {
        return (
            <div>
                <Provider store={store}>
                    <div>
                        <Route exact path="/" component={Home} />
                        <Route path="/ownersignup" component={OwnerSignup} />
                        <Route path="/login" component={Login} />
                        <Route path="/home" component={Login} />
                        <Route path="/usersignup" component={UserSignup} />
                        <Route path="/update-profile" component={UpdateProfile} />
                    </div>
                </Provider>
            </div>
        );
    }
}

export default Main;