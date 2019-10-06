import React, { Component } from 'react';
import Navbar from '../Navbar/navbar'
import swal from 'sweetalert';
import rootUrl from '../config/settings';
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
        axios.post(rootUrl + '/cart/showCart')
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

    placeOrder = () => {
        axios.post(rootUrl + '/orders/orderItems')
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                    swal("Success", "Your order has been placed", "success")

                    // this.props.history.push('/searchresults')
                }
                else {
                    console.log("Didn't fetch items data")
                }
            })
    }
    deleteFromCart = (itemId) => {
        console.log(itemId);
        const data = {
            itemId: itemId
        }
        axios.post(rootUrl + '/cart/deleteCartItem', data)
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                    swal("Success", "Item Deleted from Cart", "success")

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
            let message = ""
            if (cartTotal === 0) {
                message = "Your Cart is empty. Please add food to cart to place order."
            }
            return (

                <div>
                    <Navbar />
                    <div>
                        {cart}
                        {message}
                        <span id="placeorder">
                            <p id="carttotal">Your cart total : ${cartTotal}</p>
                            <button onClick={this.placeOrder} className="btn btn-success" >Place Order</button>
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