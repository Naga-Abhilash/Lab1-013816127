import React, { Component } from 'react';


class OdrerItems extends Component {
    state = {}
    render() {
        let item = this.props.itemsInOrder
        console.log("item in itemorders file:", item);
        let {  itemName, itemQuantity, itemPrice, itemTotal } = item;
        return (
            <div>
                <div>
                    <span>
                        <h5 className="item-name">{itemName}</h5>
                        <p className="item-price" >Cost: ${itemPrice}</p>
                        <p className="item-quantity" >Quantity: {itemQuantity}</p>
                        <p className="item-total" > Total: ${itemTotal}</p>
                    </span>
                </div>
            </div>
        );
    }
}

export default OdrerItems;