import React, { Component, PureComponent } from 'react';
import Navbar from '../Navbar/Navbar';
import RestCard from './restCards';
import LeftPanel from './leftPanel';
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import { rootUrl } from '../../components/config/settings';
import './cardstyles.css';

let redirectVar = null;
class searchResults extends Component {
    constructor() {
        super()
        this.state = {
            restSearchResults: "",
            restCuisineResults: ""
        }
    }  
    
    componentDidMount(){
        if (localStorage.getItem("restaurantResults")){
            let restResultsBySearch = localStorage.getItem("restaurantResults")
            let restDetails = JSON.parse(restResultsBySearch);
            this.setState({
            
                restSearchResults : restDetails
            })
            console.log(restDetails)
        }
        if (localStorage.getItem("restCuisineDetails")) {
            let restResultsBySearch = localStorage.getItem("restCuisineDetails")
            let restDetails = JSON.parse(restResultsBySearch);
            this.setState({

                restCuisineResults: restDetails
            })
        }
    }

    
    visitRestaurant = (restId) => {
        console.log("in VisitRestaurant method");
        console.log(restId) 

        const data = {
            restId: restId
        }
        axios.post(rootUrl + '/itemsByRestaurant', data)
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    let itemDetails = JSON.stringify(response.data)
                    console.log(response.data);

                    localStorage.setItem('itemsByRestaurant', itemDetails)
                    console.log("itemDetails:" + typeof itemDetails)
                    this.props.history.push('/resthome')
                }
                else {
                    console.log("Didn't fetch items data")
                }
            })

    }
    visitCuisine = (cuisineName) => {
        //e.preventDefault()
        console.log("in VisitCuisine method");
        console.log(cuisineName);
        
        //console.log(copyResults[id])
        let itemName = localStorage.getItem("itemName")
        const data = {
            cuisineName: cuisineName,
            itemName: itemName
        }
        console.log(data)
        if(data.cuisineName){
        axios.post(rootUrl + '/restaurantsbyItemCuisine', data)
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    let restCuisineDetails = JSON.stringify(response.data)
                    console.log(response.data);

                    localStorage.setItem('restCuisineDetails', restCuisineDetails)
                    console.log("itemDetails:" + restCuisineDetails)
                    window.location.reload();
                    // this.props.history.push('/searchresults')
                }
                else {
                    console.log("Didn't fetch items data")
                }
            })
        }
        else{
            alert("Please try again")
        }
    }
    
    
    render() {
        
        let route = null
        if (this.state.restCuisineResults){
            route = this.state.restCuisineResults;
            localStorage.removeItem("restCuisineDetails")
        }
        else if(this.state.restSearchResults){
            route = this.state.restSearchResults;
        }
        if (route) {
            let restCards = route.map((restaurant, index) => {
                return (
                    <RestCard
                        key={restaurant.restId}
                        restIndividual={restaurant}
                        visitRest={this.visitRestaurant.bind(this)}
                    />
                )
            })

            let cuisinePanel = this.state.restSearchResults.map((cuisine, ind) => {
                return (
                    <LeftPanel
                        key={cuisine.cuisineId}
                        cuisineIndividual={cuisine}
                        visitCuisine={this.visitCuisine.bind(this)}
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
                                {cuisinePanel}
                            </div>
                        </div>
                        <div id="right">
                            <div id="search-results-text"><p>Your Search Results....</p></div>
                            <div className="card-group" >
                                {restCards}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        // let restCards = this.state.people.map(person => {
        //     return (
        //         <RestCard key={person.id} removePerson={this.removePerson.bind(this)} person={person} />
        //     )
        // })
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

export default searchResults;