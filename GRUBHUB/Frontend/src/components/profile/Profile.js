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
        this.handleChange = this.handleChange.bind(this);
        
        //this.getUserDetails = this.getUserDetails.bind(this);
    }
    handleChange = e => {
        e.preventDefault()
        this.setState({
            [e.target.id]: e.target.value
        });
    }
    
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
                    <input onChange={this.handleChange} name="restaurantName" type="text" className="form-control" id="RestaurantName" value= {this.state.RestaurantName} required disabled/>
                </div>
                <div className="form-group">
                    <label>Restaurant Address</label>
                    <input onChange={this.handleChange} name="restaurantAddress" type="text" className="form-control" id="RestaurantAdr" value= {this.state.RestaurantAdr} required disabled/>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label>Phone Number:</label>
                        <input onChange={this.handleChange} value= {this.state.RestaurantPhone} name="restaurantPhone" type="text" className="form-control" id="RestaurantPhone" pattern="[0-9]{10}" required disabled/>
                    </div>
                    <div className="form-group col-md-2">
                        <label >Zip</label>
                        <input onChange={this.handleChange} value= {this.state.RestaurantZip} name="restaurantZip" type="number" className="form-control" id="RestaurantZip" required disabled/>
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
                                        <input onChange={this.handleChange} name="userEmail" type="email" className="form-control" id="userEmail" value= {this.state.userEmail} disabled />
                                    </div>
                                    <div >
                                        <label>Profile image</label><br />
                                        <input onChange={this.handleChange} name="userImage" type="file" id="userImage" placeholder="Upload your image here" disabled accept="image/png, image/jpeg" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Your Full name:</label>
                                        <input onChange={this.handleChange} name="userFullName" type="text" className="form-control" id="userName"value= {this.state.userName} disabled />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Address</label>
                                        <input onChange={this.handleChange} name="userAddress" type="text" className="form-control" id="userAddress" value= {this.state.userAdr} disabled />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label >Phone Number</label>
                                        <input onChange={this.handleChange} name="userPhone" type="text" pattern="[0-9]{10}" className="form-control" id="userPhone" value= {this.state.userPhone} disabled />
                                    </div>

                                    <div className="form-group col-md-2">
                                        <label>Zip</label>
                                        <input onChange={this.handleChange} name="userZip" type="number" className="form-control" id="inputZip" value= {this.state.userZip} disabled />
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
