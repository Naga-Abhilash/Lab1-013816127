import React, { Component } from 'react';
import { rootUrl } from '../../components/config/settings';
import { Redirect } from 'react-router-dom'
import ItemCard from './itemCard'
import Navbar from '../Navbar/Navbar'
import './restHome.css'
import RestCuisines from './restCuisines'
import './restHome.css'

class RestaurantHome extends Component {
    constructor() {
        super()
        this.state = {
            itemsByRestaurant: "",
            itemsByrestCuisine: "",
            itemUniqueTypes: ""
        }
    }
    componentDidMount() {
        let itemsByRestaurant = sessionStorage.getItem("itemsByRestaurant")
        let sessionItemDetails = JSON.parse(itemsByRestaurant);
        let lookup = {};
        let items = sessionItemDetails;
        let result = [];

        for (let item, i = 0; item = items[i++];) {
            let itemtype = item.itemType;

            if (!(itemtype in lookup)) {
                lookup[itemtype] = 1;
                result.push(itemtype);
            }
        }
        result.sort();
        console.log(result)
        this.setState({
            itemsByRestaurant: sessionItemDetails,
            itemUniqueTypes: result
        })
    }
    visitItem =() => {

    }
    itemByItemType = (itemName) => {
        //e.preventDefault()
        console.log("in itemByItemType method");
        console.log(itemName)
        const data = {
            itemName : itemName,
            restId: this.state.itemsByRestaurant[0].restId
        }

        // axios.post(rootUrl + '/restaurantsbyItemCuisine', data)
        //     .then(response => {
        //         console.log(response)
        //         if (response.status === 200) {
        //             let restCuisineDetails = JSON.stringify(response.data)
        //             console.log(response.data);

        //             sessionStorage.setItem('restCuisineDetails', restCuisineDetails)
        //             console.log("itemDetails:" + restCuisineDetails)
        //             window.location.reload();
        //             // this.props.history.push('/searchresults')
        //         }
        //         else {
        //             console.log("Didn't fetch items data")
        //         }
        //     })
    }

   
    render() {
        let redirectVar = null;
        let itemDetails = null;
        if (!this.state.itemsByRestaurant) {
            redirectVar = <Redirect to="/searchresults" />
        }

        if (this.state.itemsByRestaurant) {
            itemDetails = this.state.itemsByRestaurant.map((item, index) => {
                return (
                    <ItemCard
                        key={item.itemId}
                        itemIndividual={item}
                        visitItem={this.visitItem.bind(this)}
                    />
                )
            })
            let itemPanel = this.state.itemUniqueTypes.map((itemtype, ind) => {
                return (
                    <RestCuisines
                        //key={cuisine.cuisineId}
                        itemTypeIndividual={itemtype}
                        itemByItemType={this.itemByItemType.bind(this)}
                    />
                )
            })
            return (
                <div>
                    {redirectVar}
                    <Navbar />
                    <div>
                        <div className="restLeft" id="left">
                            <div className="list-group">
                                {itemPanel}
                            </div>
                        </div>
                        <div id="right">
                            {/* <div id="search-results-text"><p>Your Search Results....</p></div> */}
                            <div className="card-group" >
                                {itemDetails}
                            </div>
                        </div>
                    </div>

                </div>
            );
        }
        else {
            return (
                <div>
                    <Navbar />
                    <h3>No Items found. </h3>
                </div>
            );
        }

    }
}

export default RestaurantHome;