import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar.js';
import axios from 'axios';
import { getProfile } from '../../redux/actions/profileAction' 
import { connect } from 'react-redux';
import { updateProfile } from '../../redux/actions/profileAction'
import {Redirect} from 'react-router-dom'

let redirectvar = null;
const btn_submit = {
    visibility : 'hidden'
}

class Profile extends Component {
    constructor() {
        super();

        this.state = {
            userName: "",
            userEmail: localStorage.getItem('email'),
            userAdr: "",
            userPhone: "",
            userZip: "",

            RestaurantName: "",
            RestaurantAdr:"",
            RestaurantZip: "",
            RestaurantPhone: "",

            isNewUserCreated: false,
            validationError: false,
            errorRedirect: false
        }

        //bind
        this.fullNameHandler = this.fullNameHandler.bind(this);
        this.restaurantNameHandler = this.restaurantNameHandler.bind(this);
        this.emailHandler = this.emailHandler.bind(this);
        this.imageHandler = this.imageHandler.bind(this);
        this.addressHandler = this.addressHandler.bind(this);
        this.zipCodeHandler = this.zipCodeHandler.bind(this);
        this.phoneNumberHandler = this.phoneNumberHandler.bind(this);
        this.submitProfile = this.submitProfile.bind(this);
        this.restaurantPhoneNumberHandler = this.restaurantPhoneNumberHandler.bind(this);
        this.restaurantAddressHandler = this.restaurantAddressHandler.bind(this);
        this.restaurantZipCodeHandler = this.restaurantZipCodeHandler.bind(this);
        //this.getUserDetails = this.getUserDetails.bind(this);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    
    fullNameHandler = (e) => {
        this.setState({
            userName: e.target.value
        })
    }


    restaurantNameHandler = (e) => {
        this.setState({
            RestaurantName: e.target.value
        })
    }


    emailHandler = (e) => {
        this.setState({
            userEmail: e.target.value
        })
    }

    imageHandler = (e) => {
        this.setState({
            Password: e.target.value
        })
    }

    addressHandler = (e) => {
        this.setState({
            userAdr: e.target.value
        })
    }

    zipCodeHandler = (e) => {
        this.setState({
            userZip: e.target.value
        })
    }

    phoneNumberHandler = (e) => {
        this.setState({
            userPhone: e.target.value
        })
    }

    restaurantZipCodeHandler = (e) => {
        this.setState({
            RestaurantZip: e.target.value
        })
    }

    restaurantPhoneNumberHandler = (e) => {
        this.setState({
            RestaurantPhone: e.target.value
        })
    }

    restaurantAddressHandler = (e) => {
        this.setState({
            RestaurantAdr: e.target.value
        })
    }
    

    // saveChanges = (e) => {
    //     e.preventDefault();
    //     axios.defaults.withCredentials = true;

    //     const data = {
    //         Firstname: this.state.Firstname,
    //         Lastname: this.state.Lastname,
    //         Email: this.state.Email,
    //         Phonenumber: this.state.Phonenumber,
    //         Aboutme: this.state.Aboutme,
    //         Country: this.state.Country,
    //         City: this.state.City,
    //         Gender: this.state.Gender,
    //         School: this.state.School,
    //         Hometown: this.state.Hometown,
    //         Language: this.state.Language,
    //         Company: this.state.Company,
    //         ProfileImage: this.state.ProfileImage


    //     }

    //     console.log('Data: ', data);
    //     axios.post('http://localhost:3001/update-profile', data)
    //         .then(response => {
    //             if (response.status === 200) {
    //                 console.log('');
    //             }
    //         }).catch((err) =>{
    //             if(err){
    //                 this.setState({
    //                     errorRedirect: true
    //                 })
    //             }
    //         });

    // }


    submitProfile = (e) =>{
        e.preventDefault()
        console.log("in submit profile");
        let data = null;
        if(this.state.RestaurantName){
            data = {
                UserEmail: this.state.userEmail,
                UserName: this.state.userName,
                UserPhone: this.state.userPhone,
                UserAdr: this.state.userAdr,
                UserZip: this.state.userZip,

                RestaurantName: this.state.RestaurantName,
                RestaurantAdr:this.state.RestaurantAdr,
                RestaurantZip: this.state.RestaurantZip,
                RestaurantPhone: this.state.RestaurantPhone
            }
        }
        else{
            data = {
                UserEmail: this.state.userEmail,
                UserName: this.state.userName,
                UserPhone: this.state.userPhone,
                UserAdr: this.state.userAdr,
                UserZip: this.state.userZip
            }
        }
        console.log("in submit profile  data:" + data);
        this.props.updateProfile(data
            , (res) => {
                console.log("update profile", res.data)

                if(res.status == 200){
                    console.log("status is 200");
                    this.savechanges()
                    redirectvar = <Redirect to= "/profile"/>
                }
        })
    }

    edit() {
        var el = document.getElementById('btn-edit');
        var frm = document.getElementById('edit-information');
        if (el.value == 'Edit profile') {
            el.addEventListener('click', function () {
                for (var i = 1; i < frm.length; i++) {
                    frm.elements[i].disabled = false;
                }
                frm.elements[0].focus();
                document.getElementById('btn-edit').style.visibility="hidden";
                document.getElementById('btn-submit').style.visibility="visible";
            });
        }
    }

    savechanges() {
        var el = document.getElementById('btn-submit');
        var frm = document.getElementById('edit-information');
        if(el){
            for (var i = 1; i < frm.length-2; i++) {
                frm.elements[i].disabled = true;
            }
            document.getElementById('btn-edit').style.visibility = "visible";
            document.getElementById('btn-submit').style.visibility = "hidden";
        }
    }

    componentDidMount(){
        var data = {
            UserEmail: localStorage.getItem('email')
        }
        console.log("data before get profile", data)
        
        this.props.getProfile(data, (res) => {
            
            //var data = res.data;
            console.log("In get profile");
            console.log(Object.keys(res.data).length)
            
            this.setState({
                userEmail: res.data[0].UserEmail,
                userName: res.data[0].UserName,
                userPhone: res.data[0].UserPhone,
                userAdr: res.data[0].UserAdr,
                userZip: res.data[0].UserZip
            });
            if(Object.keys(res.data).length > 1){
                this.setState({
                RestaurantName: res.data[1].RestaurantName,
                RestaurantAdr: res.data[1].RestaurantAdr,
                RestaurantZip: res.data[1].RestaurantZip,
                RestaurantPhone: res.data[1].RestaurantPhone
            });
            }
        });
        
    } 
        

    render() {
        var restaurants = null;
        if(this.state.RestaurantName){
            restaurants = 
            <div>
                <h3> Your restaurant details: </h3> 
                <div className="form-group">
                    <label>Restaurant name:</label>
                    <input onChange={this.restaurantNameHandler} name="restaurantName" type="text" className="form-control" id="inputAddress" value= {this.state.RestaurantName} required disabled/>
                </div>
                <div className="form-group">
                    <label>Restaurant Address</label>
                    <input onChange={this.restaurantAddressHandler} name="restaurantAddress" type="text" className="form-control" id="inputAddress2" value= {this.state.RestaurantAdr} required disabled/>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label>Phone Number:</label>
                        <input onChange={this.restaurantPhoneNumberHandler} value= {this.state.RestaurantPhone} name="restaurantPhone" type="text" className="form-control" id="inputPhone" pattern="[0-9]{10}" required disabled/>
                    </div>
                    <div className="form-group col-md-2">
                        <label >Zip</label>
                        <input onChange={this.restaurantZipCodeHandler} value= {this.state.RestaurantZip} name="restaurantZip" type="number" className="form-control" id="inputZip" required disabled/>
                    </div>
                </div>
            </div>
        }
       

        return (
            <div>
                <Navbar />
                {redirectvar}
                <div className="container fill-graywhite">
                   
                    <div className="container content">
                        <div className="login-container">
                            <form id="edit-information">

                                <h3>Click edit button below to Edit your profile</h3>

                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Email</label>
                                        <input onChange={this.emailHandler} name="userEmail" type="email" className="form-control" id="inputEmail4" value= {this.state.userEmail} disabled />
                                    </div>
                                    <div >
                                        <label>Profile image</label><br />
                                        <input onChange={this.imageHandler} name="userImage" type="file" id="userImage" placeholder="Upload your image here" disabled accept="image/png, image/jpeg" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Your Full name:</label>
                                        <input onChange={this.fullNameHandler} name="userFullName" type="text" className="form-control" id="inputAddress"value= {this.state.userName} disabled />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Address</label>
                                        <input onChange={this.addressHandler} name="userAddress" type="text" className="form-control" id="inputAddress2" value= {this.state.userAdr} disabled />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label >Phone Number</label>
                                        <input onChange={this.phoneNumberHandler} name="userPhone" type="text" pattern="[0-9]{10}" className="form-control" id="inputNumber" value= {this.state.userPhone} disabled />
                                    </div>

                                    <div className="form-group col-md-2">
                                        <label>Zip</label>
                                        <input onChange={this.zipCodeHandler} name="userZip" type="number" className="form-control" id="inputZip" value= {this.state.userZip} disabled />
                                    </div>
                                </div>
                                {restaurants}
                                <div className="formholder">
                                    <span>
                                        <input className="btn btn-primary" type="button" id="btn-edit" onClick={this.edit} value="Edit profile" />
                                        <input className="btn btn-success" type="button" id="btn-submit" onClick={this.submitProfile} value="save changes" style = {btn_submit}/>
                                    
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        profile: state.profile
    };
}

export default (connect(mapStateToProps, { getProfile, updateProfile })(Profile));
