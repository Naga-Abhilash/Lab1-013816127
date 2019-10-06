import React, { Component } from "react";
// import NavBar from "../../Navbar/navbar";
import logo from '../../images/login-page-burger.png'
// import EditItem from "./edititem";
import {Link} from 'react-router-dom'
import axios from 'axios';
import rootUrl from "../config/settings";

// var images = require.context('../../../../backend/uploads/', true);

class Items extends Component{
    constructor(props){
        super(props)
        this.state={
         items: [ ],
        sections: [ ],
        photos: []
        }
    this.selectItems=this.selectItems.bind(this)
    this.deleteItem=this.deleteItem.bind(this)
    }

    componentDidMount(){
        console.log("Inside get profile after component did mount");
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.get(rootUrl+'/restaurant/allsections')
            .then(response => {
                console.log("inside success" )
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("response",response.data)
                    this.setState({
                        sections: response.data
                    });
                }
            })
            .catch(error => {
                console.log("In error");
                console.log(error);
                // alert("User credentials not valid. Please try again!");
            })
            axios.get(rootUrl+'/restaurant/allitems')
            .then(response => {
                console.log("inside success" )
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("response",response.data)
                    this.setState({
                        items: response.data
                    });
                    console.log("items",this.state.items)
                    // var imageArr = [];
                    // var photoList = this.state.items.itemImage;
                    // for (let i = 0; i < this.state.items.length; i++) {
                        // axios.post('http://localhost:3001/profile/download-file/' + this.state.items[i].itemImage)
                        //     .then(response => {
                        //         //console.log("Imgae Res : ", response);
                        //         let imagePreview = 'data:image/jpg;base64, ' + response.data;
                        //         imageArr.push(imagePreview);
                        //         const photoArr = this.state.photos.slice();
                        //         photoArr[i] = imagePreview;
                        //         this.setState({
                        //             photos: photoArr
                        //         });

                        //         console.log('PhotoArr: ', photoArr);
                        //         console.log('Photo State: ', this.state.photos);
                        //     })
                // }
            }
        })
            .catch(error => {
                console.log("In error");
                console.log(error);
                // alert("User credentials not valid. Please try again!");
            })
    }

    selectItems(details){
        const data = {
            itemType: details
         }
        console.log("data",data)
        axios.post(rootUrl+'/restaurant/itemsbasedonsections',data)
            .then(response => {
                console.log("inside success" )
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("response",response.data)
                    this.setState({
                        items: response.data
                    });
                    // var imageArr = [];
                    // // var photoList = this.state.items.itemImage;
                    // for (let i = 0; i < this.state.items.length; i++) {
                    //     console.log(this.state.items[i].itemImage)
                    //     if(this.state.items[i].itemImage!= null || this.state.items[i].itemImage!= ""){
                    //     axios.post('http://localhost:3001/profile/download-file/' + this.state.items[i].itemImage)
                    //         .then(response => {
                    //             //console.log("Imgae Res : ", response);
                    //             let imagePreview = 'data:image/jpg;base64, ' + response.data;
                    //             imageArr.push(imagePreview);
                    //             const photoArr = this.state.photos.slice();
                    //             photoArr[i] = imagePreview;
                    //             this.setState({
                    //                 photos: photoArr
                    //             });

                    //             console.log('PhotoArr: ', photoArr);
                    //             console.log('Photo State: ', this.state.photos);
                    //         })
                    //     }
                // }
            }
            })
            .catch(error => {
                console.log("In error");
                console.log(error);
                // alert("User credentials not valid. Please try again!");
            })

    }

    deleteItem(details){
        const data={
            itemId: details
        }
        console.log("data",data)
        axios.put(rootUrl+'/restaurant/deleteitem',data)
            .then(response => {
                console.log("inside success" )
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("response",response.data)
                    alert("success")
                }
            })
            .catch(error => {
                console.log("In error");
                console.log(error);
                // alert("User credentials not valid. Please try again!");
            })

    }

    render(){

        let itemDetails;
        let sectionDetails;
        sectionDetails = this.state.sections.map((section)=>{
                return (
                    <div className="col-md-4">
                        <div className="card">
                            <button className="btn btn-outline-primary text-center text-dark" onClick={() => this.selectItems(section.itemType)}>{section.itemType}</button>
                         </div>
                    </div>
                )
        })
        itemDetails = this.state.items.map((item,index) => {
            if(item.itemImage){
            var profileImagePreview = rootUrl+'/profile/download-file/' + item.itemImage
            console.log("item image", profileImagePreview)
            }
            else{
            var profileImageData = <img  src='https://mk0tarestaurantt3wcn.kinstacdn.com/wp-content/uploads/2018/01/premiumforrestaurants_0.jpg' className="card-img-top img-responsive fit-image" alt="logo" />
            }
            if (profileImagePreview) {
                profileImageData = <img src={profileImagePreview} className="card-img-top img-responsive fit-image" alt="logo" />
            }
            // let profileImageData = <img src={logo} className="card-img-top img-responsive fit-image" id="itemimage" alt="..."/>
            // if (this.state.photos[index]) {
            //     profileImageData = <img src={this.state.photos[index]} className="card-img-top img-responsive fit-image" id="itemimage" alt="..."/>
            // }
            // if (item.itemImage === "" || item.itemImage== null) {
            //     item.itemImage = "biryani.jpg"
            // }
            // let unknown = images(`./${item.itemImage}`)
            return (
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                {/* <img src={logo} className="card-img-top img-responsive fit-image" id="itemimage" alt="..."/> */}
                                {profileImageData}
                                {/* <img src={unknown} className="card-img-top img-responsive fit-image" id="card-img-top" alt="..." /> */}
                                <h5 className="card-title">{item.itemName}</h5>
                                {/* <h6 className="card-subtitle mb-2">Item Name: {item.itemName}</h6> */}
                                <p className="card-text font-weight-bold text-muted">Item Price: {item.itemPrice}</p>
                                <p className="card-text font-weight-bold  text-muted">Item Description: {item.itemDesc}</p>
                                <p className="card-text font-weight-bold  text-muted">Section: {item.itemType}</p>
                                <p className="card-text font-weight-bold  text-muted">Cuisine: {item.cuisineName}</p>
                                {/* <button className="btn btn-outline-primary" onClick={this.editItem}>Edit</button> */}
                                <Link to={{
                                    pathname: `/edititem`,
                                    item: item
                                }} className="btn btn-outline-primary">Edit</Link>&nbsp;&nbsp;&nbsp;
                                <button className="btn btn-outline-danger" onClick={() => this.deleteItem(item.itemId)}>Delete</button>
                            </div>
                        </div>
                    </div>
                )
        })
        return(
            <div>
            <h5>Sections:</h5><p className="text-muted inline">Select a section to view items in that section!</p><br/>
            <div className="card-group">
                  {sectionDetails}
            </div><br/>
            <h5>Items:</h5><br/>
            <div className="card-group">
                   {itemDetails}
            </div>
            </div>
        )
    }
}

export default Items;