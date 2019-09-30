import React, { Component } from 'react';
import { rootUrl } from '../../components/config/settings';
import { Redirect } from 'react-router-dom'
import ItemCard from './itemCard'
import Navbar from '../Navbar/Navbar'
import './restHome.css'
import RestCuisines from './restCuisines'
import swal from 'sweetalert';

var images = require.context('../../images', true);

class RestaurantHome extends Component {
    constructor() {
        super()
        this.state = {
            itemsByRestaurant: "",
            itemsByrestCuisine: "",
            itemUniqueTypes: "",
            itemQuantity : ""
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
        console.log(sessionItemDetails.length);

        result.sort();
        console.log(result)
        for (let item, i = 0; item = items[i++];) {
            // let itemName = {item.itemName: 0};
            // this.setState({
            //     itemQuantity: 0
            // })
        }
        this.setState({
            itemsByRestaurant: sessionItemDetails,
            itemUniqueTypes: result
        })
    }

    itemByItemType = (itemName) => {
        //e.preventDefault()
        console.log("in itemByItemType method");
        console.log(itemName)
        const data = {
            itemName: itemName,
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

    togglePopup = (id) => {
        console.log("in togglePopup with Id: " + this.state.showPopup);
        console.log(id)
        // document.getElementById(docid).addEventListener("click", function () {
        //     document.querySelector('.bg-modal').style.display = "flex";
        // });

        // document.querySelector('.close').addEventListener("click", function () {
        //     document.querySelector('.bg-modal').style.display = "none";
        // });

        // this.setState({
        //     showPopup: !this.state.showPopup
        // });
    }
    handleItemQuantity = () =>{
        console.log("handle quantity");
        
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
                        handleItemQuantity = {this.handleItemQuantity.bind(this)}
                        togglePopup={this.togglePopup.bind(this)}
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
            let { restImage, restName, restAddress, restPhone } = this.state.itemsByRestaurant[0];
            if (restImage === "") {
                restImage = "biryani.jpg"
            }
            let unknown = images(`./${restImage}`);
            let resimg = new Image();
            resimg = unknown;

            

            return (
                <div>
                    {redirectVar}
                    <Navbar />
                    <div className="container">
                        <img src={unknown} id="restHomeImage" alt="..." />
                        <div>
                            <div className="rest-home-details" >
                                <h2 className="rest-title">{restName}</h2>
                                <span>
                                    <p className="text-left">{restAddress}</p>
                                    <p className="text-phone"> Phone:  {restPhone}</p>
                                </span>
                            </div>
                        </div>
                        <div className="item-type-Left" id="left-items">
                            <div className="list-group">
                                {itemPanel}
                            </div>
                        </div>
                        <div id="right-items" className="rest-item-Right">
                            <div className="card-group" >
                                {itemDetails}
                            </div>
                        </div>
                    </div>
                        < div className="bg-modal" >
                            <div className="modal-contents">

                                <div className="close">+</div>
                                {/* <img src="https://richardmiddleton.me/comic-100.png" alt=""/> */}

                                <form action="">
                                    <input type="text" placeholder="Name" />
                                    <input type="email" placeholder="E-Mail" />
                                    <a href="#" className="btn btn-primary">Submit</a>
                                </form>

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