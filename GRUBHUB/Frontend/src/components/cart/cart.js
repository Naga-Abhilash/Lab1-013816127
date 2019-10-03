import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar'
import swal from 'sweetalert';
import { rootUrl } from '../../components/config/settings';
import axios from 'axios'
import CartCard from './cartCard'
import './cartCardcss.css'

class Cart extends Component {
    constructor() {
        super()
        this.state = {
            cartItems: "",
            cartTotal: ""
        }
    }
    componentDidMount = () => {
        axios.post(rootUrl + '/showCart')
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    console.log(response.data);
                    console.log("data received");
                    let itemsInCart = JSON.stringify(response.data)
                    this.setState({
                        cartItems: itemsInCart
                    })
                }
                else {
                    console.log("Didn't fetch items data")
                }
            })
    }


    deleteFromCart = (itemId) => {
        console.log(itemId);
        const data = {
            itemId:itemId
        }
        axios.post(rootUrl + '/deleteCartItem', data)
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    swal("Success","Item Deleted from Cart", "success")
                    // this.props.history.push('/searchresults')
                }
                else {
                    console.log("Didn't fetch items data")
                }
            })

    }
    render() {
        let cart = "";
        let route = '';
        if (this.state.cartItems) {
            route = JSON.parse(this.state.cartItems)
        }
        let cartTotal = 0;
        if (route) {
            cart = route.map((cartItem, index) => {
                cartTotal += cartItem.itemTotal;
                return (
                    <CartCard
                        key={cartItem.itemId}
                        itemIndividual={cartItem}
                        deleteFromCart={this.deleteFromCart.bind(this)}
                    />
                )

            })
            return (

                <div>
                    <Navbar />
                    <div>
                        {cart}
                        <span id="placeorder">
                            <p id="carttotal">Your cart total : ${cartTotal}.00</p>
                            <button className="btn btn-success" >Place Order</button>
                        </span>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div>
                    <h5>Your cart is Emply. Add items to cart to purchase...</h5>
                </div>
            )
        }
    }
}

export default Cart;