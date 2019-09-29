import React, { Component } from 'react';
import './restHome.css'


var images = require.context('../../images', true);

class ItemDisplay extends Component {
    state = {}
    render() {
        
        let { itemId, itemName, itemPrice, itemImage } = this.props.itemIndividual
        if (itemImage === "") {
            itemImage = "biryani.jpg"
        }
        let unknown = images(`./${itemImage}`)
        
        return (

            <div>  
                <div className="itemRight" >
                    <div className="col-md-3 col-sm-6">
                        <div className="card cardclass" id={itemName} >
                            <img src={unknown} className="card-img-top" alt="..." />
                            <div className="card-block" id="card-title-text">
                                <h4 className="card-title">{itemName}</h4>
                                <p className="card-text">${itemPrice}.00</p>
                                <button id="btn-item-add-to-cart" onClick={() => this.props.addToCart(this.props.itemIndividual.itemId)} className="btn btn-success">Add to cart </button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default ItemDisplay;