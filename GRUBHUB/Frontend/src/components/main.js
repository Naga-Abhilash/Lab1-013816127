import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import Home from './home/home'
import Login from './Login/login'
import Signup from './Signup/Signup'
import Profile from './profile/Profile' ;
import restCard from './Search/restCards';
import searchResults from './Search/searchResults'
import Testcss from './Search/testcss'
import RestaurantHome from './restaurants/restaurantHome'
import Cart from './cart/cart'
import PastOrders from './userOrders/pastOrders'
import UpcomingOrders from './userOrders/upcomingOrders'

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
                    <Route path="/restcard" component={restCard}/>
                    <Route path="/searchresults" component={searchResults}/>
                    <Route path="/testcss" component={Testcss} />
                    <Route path="/resthome" component={RestaurantHome} />
                    <Route path = "/cart" component = {Cart}/>
                    <Route path="/pastorders" component={PastOrders} />
                    <Route path="/upcomingorders" component={UpcomingOrders} />

                </div>
            </div>
        );
    }
    
}

export default Main;