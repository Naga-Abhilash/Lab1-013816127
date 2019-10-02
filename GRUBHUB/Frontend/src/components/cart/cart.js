import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar'
import swal from 'sweetalert';
import { rootUrl } from '../../components/config/settings';
import axios from 'axios'

class Cart extends Component {
    constructor(){
        super()
        this.state = {
            cartItems : ""
        }
    }
    componentDidMount = () => {
        axios.post(rootUrl + '/showCart')
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    console.log(response.data);
                    
                    // this.setState({

                    // })
                }
                else {
                    console.log("Didn't fetch items data")
                }
            })
    }

    render() {
        return (

            <div>
                <Navbar />
                <div>

                </div>
            </div>
        );
    }
}

export default Cart;