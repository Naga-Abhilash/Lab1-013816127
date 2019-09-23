import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar.js';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import "../../App.css";

class UpdateProfile extends Component {
    constructor() {
        super();

        this.state = {
            FullName: "",
            RestaurantName: "",
            Email: "",
            Password: "",
            Address: "",
            PhoneNumber: "",
            ZipCode: "",
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
    }

    fullNameHandler = (e) => {
        this.setState({
            FullName: e.target.value
        })
    }


    restaurantNameHandler = (e) => {
        this.setState({
            RestaurantName: e.target.value
        })
    }


    emailHandler = (e) => {
        this.setState({
            Email: e.target.value
        })
    }

    imageHandler = (e) => {
        this.setState({
            Password: e.target.value
        })
    }

    addressHandler = (e) => {
        this.setState({
            Address: e.target.value
        })
    }

    zipCodeHandler = (e) => {
        this.setState({
            ZipCode: e.target.value
        })
    }

    phoneNumberHandler = (e) => {
        this.setState({
            PhoneNumber: e.target.value
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


    edit() {
        var el = document.getElementById('btn-edit');
        var frm = document.getElementById('edit-information');
        if (el) {
            el.addEventListener('click', function () {
                for (var i = 0; i < frm.length; i++) {
                    frm.elements[i].disabled = false;
                }
                frm.elements[0].focus();
                document.getElementById('btn-edit').value = "Save changes"
            });
        }
    }
    render() {

        let redirectVar = null;
        if (this.state.isNewUserCreated === true) {
            redirectVar = <Redirect to="/login" />
        }

        if (this.state.errorRedirect === true) {
            redirectVar = <Redirect to="/error" />
        }

        let errorAlert = null;
        if (this.state.validationError) {
            errorAlert = <div>
                <div className="alert alert-danger" role="alert">
                    <strong>Error!</strong> Fill all the fields to proceed!
            </div>
            </div>
        }

        return (
            <div>

                <Navbar />
                <div className="container fill-graywhite">
                    {redirectVar}
                    <div className="container content">
                        <div className="login-container">
                            <form id="edit-information">

                                <h3>Click edit button below to Edit your profile</h3>

                                <div className="form-row">
                                    <div >
                                        <label>Profile image</label><br />
                                        <input onChange={this.imageHandler} name="userImage" type="file" id="userImage" placeholder="Upload your image here" disabled accept="image/png, image/jpeg" />
                                    </div>
                                    <div className="form-group col-md-6" id="btn-cancel">
                                        <label>Email</label>
                                        <input onChange={this.emailHandler} name="userEmail" type="email" className="form-control" id="inputEmail4" placeholder="Email" disabled />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Your Full name:</label>
                                    <input onChange={this.fullNameHandler} name="userFullName" type="text" className="form-control" id="inputAddress" placeholder="Ex: Mary Smith" disabled />
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input onChange={this.addressHandler} name="userAddress" type="text" className="form-control" id="inputAddress2" placeholder="1234 Main St, Apt, studio, or floor" disabled />
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label >Phone Number</label>
                                        <input onChange={this.phoneNumberHandler} name="userPhone" type="text" pattern="[0-9]{10}" className="form-control" id="inputNumber" disabled />
                                    </div>

                                    <div className="form-group col-md-2">
                                        <label>Zip</label>
                                        <input onChange={this.zipCodeHandler} name="userZip" type="number" className="form-control" id="inputZip" disabled />
                                    </div>
                                </div>

                                <div className="formholder">
                                    <span>
                                        <input className="btn btn-primary" type="button" id="btn-edit" onClick={this.edit} value="Edit profile  " />
                                        <a href="/home"><input className="btn btn-danger" id="btn-cancel" type="button" value="Cancel" /></a>
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

export default UpdateProfile