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
        if (sessionStorage.getItem("restaurantResults")){
            let restResultsBySearch = sessionStorage.getItem("restaurantResults")
            let restDetails = JSON.parse(restResultsBySearch);
            this.setState({
            
                restSearchResults : restDetails
            })
            console.log(restDetails)
        }
        if (sessionStorage.getItem("restCuisineDetails")) {
            let restResultsBySearch = sessionStorage.getItem("restCuisineDetails")
            let restDetails = JSON.parse(restResultsBySearch);
            this.setState({

                restCuisineResults: restDetails
            })
        }
    }

    handlerestCuisineResults = (restDetails) => {
        this.setState({
            restCuisineResults : restDetails
        })
    }
    handlerestSearchResults = (restDetails) => {
        this.setState({
            restSearchResults: restDetails
        })
    }
    
    visitRestaurant = (index) => {
        const copyResults = Object.assign([], this.state.restSearchResults);
        console.log("in VisitRestaurant method");
        console.log(index) 

        // const data = {
        //     restId: copyResults[index].restId
        // }
        // axios.post(rootUrl + '/itemsByRestaurant', data)
        //     .then(response => {
        //         console.log(response)
        //         if (response.status === 200) {
        //             let itemDetails = JSON.stringify(response.data)
        //             console.log(response.data);

        //             sessionStorage.setItem('restItemResults', itemDetails)
        //             console.log("itemDetails:" + typeof itemDetails)
        //         }
        //         else {
        //             console.log("Didn't fetch items data")
        //         }
        //     })

    }
    visitCuisine = (cuisineName) => {
        //e.preventDefault()
        const copyResults = Object.assign([], this.state.restSearchResults);
        console.log("in VisitCuisine method");
        console.log(cuisineName);
        
        //console.log(copyResults[id])
        let itemName = sessionStorage.getItem("itemName")
        const data = {
            cuisineName: cuisineName,
            itemName: itemName
        }

        axios.post(rootUrl + '/restaurantsbyItemCuisine', data)
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    let restCuisineDetails = JSON.stringify(response.data)
                    console.log(response.data);

                    sessionStorage.setItem('restCuisineDetails', restCuisineDetails)
                    console.log("itemDetails:" + restCuisineDetails)
                    window.location.reload();
                }
                else {
                    console.log("Didn't fetch items data")
                }
            })
    }
    
    // getdetails = () =>{
    //     let restResultsBySearch = null;
    //     let restDetails = null;
    //     let cuisinePanel = null;

    //     let restCuisineBySearch = null;
    //     let route = null;

    //     // if (sessionStorage.getItem("restCuisineDetails")){
    //     //     restCuisineBySearch = sessionStorage.getItem("restCuisineDetails")
    //     //     restDetails = JSON.parse(restCuisineBySearch);
    //     //     this.handlerestCuisineResults(restDetails)
    //     //     // this.state.restCuisineResults = restDetails;
    //     //     route = this.state.restCuisineResults;
    //     // }
    //     if (!this.state.restSearchResults) {
    //         restResultsBySearch = sessionStorage.getItem("restaurantResults")
    //         restDetails = JSON.parse(restResultsBySearch);
    //         this.handlerestSearchResults(restDetails)
    //         //this.state.restSearchResults = restDetails;
    //         route = this.state.restSearchResults;
    //         // console.log(restDetails);

    //     }
    // }
    render() {
        
        if (sessionStorage.getItem("restCuisineDetails")){
            redirectVar = <Redirect to="/searchresults"/>
            console.log("inside redirect var");
            console.log(this.state);
            
        }
        let route = null
        if (this.state.restCuisineResults){
            route = this.state.restCuisineResults;
            sessionStorage.removeItem("restCuisineDetails")
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