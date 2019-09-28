import React, { Component } from 'react';
var images = require.context('../../images', true);

class ItemDisplay extends Component {
    state = {}
    render() {
        
        let { itemId, itemName, itemPrice, itemImage } = this.props.itemIndividual
        // let unknown = images(`./${itemImage}`)
        return (

            <div>  
                <div className="item-column">
                    {/* <img src={unknown} className="card-img-top" alt="..." /> */}
                    {itemName}
                </div>
                
            </div>
        );
    }
}

export default ItemDisplay;