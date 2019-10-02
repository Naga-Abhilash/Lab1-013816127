import React, { Component } from 'react';
import './restHome.css'


var images = require.context('../../images', true);

class ItemDisplay extends Component {
    
    render() {

        let { itemId, itemName, itemPrice, itemImage, restId } = this.props.itemIndividual
        if (itemImage === "") {
            itemImage = "biryani.jpg"
        }
        let unknown = images(`./${itemImage}`)
        let itemQuantity = ""
        let allQuant = this.props.quantity.Quantity;
        for(let i=0; i<allQuant.length; i++)
        if (this.props.quantity.Quantity[i].itemName == itemName){
            itemQuantity = this.props.quantity.Quantity[i].itemQuantity
            
        }
        
        return (

            <div>
                <div className="itemRight" >
                    <div className="col-md-3 col-sm-6">
                        <div className="card cardclass" id={itemName} >
                            <img src={unknown} className="card-img-top" alt="..." />
                            <div className="card-block" id="card-title-text">
                                <h6 className="card-title">{itemName}</h6>
                                <p className="card-text">${itemPrice}.00</p>
                                <span>
                                    <button className="btn btn-primary" onClick={() => this.props.handleDecrement(itemName)}> - </button>
                                    <input id="quant-text" type="number" readOnly value= {itemQuantity}   />
                                    <button id="add-button" className="btn btn-primary" onClick={() => this.props.handleIncrement(itemName)} >+</button>
                                </span>
                                <button id="btn-item-add-to-cart" onClick={() => this.props.togglePopup(itemPrice, itemId, restId, itemQuantity)} className="btn btn-success">Add to cart </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default ItemDisplay;