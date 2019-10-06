import React, { Component } from 'react';
import axios from 'axios'
import { rootUrl } from '../../components/config/settings';
import Navbar from '../Navbar/Navbar';
import UniqueOrders from './uniqueOrders'

class UpcomingOrders extends Component {
    constructor() {
        super()
        this.state = {
            userOrders: null
        }
    }

    componentDidMount = () => {
        axios.get(rootUrl + '/upcomingOrders')
            .then(response => {
                console.log(response.data)
                if (response.status === 200) {
                    console.log(typeof response.data);
                    this.setState({
                        userOrders: JSON.stringify(response.data),
                    })
                }
                else {
                    console.log("Didn't fetch previous data")
                }
            })
    }
    render() {
        let route = null
        let UniqueOdrer = ""
        let i = -1;
        if (this.state.userOrders) {
            console.log("in ");

            route = JSON.parse(this.state.userOrders)
        }
        console.log("route : ", typeof route);

        if (route) {
            UniqueOdrer = route.map((order, index) => {
                // let quant = JSON.parse(this.state.itemQuantity)
                console.log("order in mapping: ", order);
                // let neworder = JSON.stringify(order)
                i = i + 1
                return (
                    <UniqueOrders
                        key={i}
                        orderIndividual={order}
                    />
                )
            })
            return (
                <div>
                    <Navbar />
                    {UniqueOdrer}
                </div>
            );
        }
        else {
            return (
                <div>
                    <Navbar />
                    <h6>You do not have any Upcoming orders</h6>
                </div>
            )
        }
    }
}

export default UpcomingOrders;