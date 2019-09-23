import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import Navbar from '../Navbar/Navbar';

class OwnerSignup extends Component {

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
        this.passwordHandler = this.passwordHandler.bind(this);
        this.addressHandler = this.addressHandler.bind(this);
        this.zipCodeHandler = this.zipCodeHandler.bind(this);
        this.phoneNumberHandler = this.phoneNumberHandler.bind(this);
        this.signup = this.signup.bind(this);
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

    passwordHandler = (e) => {
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

    signup = (e) => {

        var data = {
            FullName: this.state.FullName,
            RestaurantName: this.state.RestaurantName,
            Email: this.state.Email,
            Password: this.state.Password,
            Address: this.state.Address,
            ZipCode: this.state.ZipCode,
            PhoneNumber: this.state.PhoneNumber
        }

        if (this.state.FullName === "" || this.state.RestaurantName === "" || this.state.Email === "" || this.state.Password == "" || this.state.Address === "" || this.state.ZipCode == "" || this.state.PhoneNumber == "") {
            this.setState({
                validationError: true
            });
        }
        else {

            e.preventDefault();

            axios.defaults.withCredentials = true;

            axios.post('http://localhost:3001/signup', data)
                .then((response) => {
                    if (response.status === 200) {
                        this.setState({
                            isNewUserCreated: true
                        })
                    }
                    else {
                        this.setState({
                            isNewUserCreated: false
                        })
                    }
                })
                .catch((err) => {
                    if (err) {
                        this.setState({
                            errorRedirect: true
                        });
                    }
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
                    <div className="container conte nt">
                        <div className="login-container">
                            <form autoComplete="off">
                                <h3>Please provide your details:</h3>
                                <p class="text-danger"><strong>You must be the owner of restaurant to fill the form:</strong></p>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label >Email</label>
                                        <input onChange={this.emailHandler} autoFocus name="ownerEmail" type="email" class="form-control" id="inputEmail4" placeholder="Email" required />
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label>Password</label>
                                        <input onChange={this.passwordHandler} name="ownerpassword" type="password" class="form-control" id="inputPassword4" placeholder="Password" pattern=".{6,15}" required />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Your Full name:</label>
                                    <input onChange={this.fullNameHandler} name="ownerName" type="text" class="form-control" id="inputAddress" placeholder="Ex: Mary Smith" required />
                                </div>

                                {/* Providing restaurant details */}
                                <h3>Please provide your Restaurant details below:</h3>
                                <div class="form-group">
                                    <label>Restaurant name:</label>
                                    <input onChange={this.restaurantNameHandler} name="restaurantName" type="text" class="form-control" id="inputAddress" placeholder="Ex: Chipotle Mexican Grill" required />
                                </div>
                                <div class="form-group">
                                    <label>Restaurant Address</label>
                                    <input onChange={this.addressHandler} name="restaurantAddress" type="text" class="form-control" id="inputAddress2" placeholder="1234 Main St" required />
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-4">
                                        <label>Phone Number:</label>
                                        <input onChange={this.phoneNumberHandler} placeholder="10 digit number" name="restaurantPhone" type="text" class="form-control" id="inputPhone" pattern="[0-9]{10}" required />
                                    </div>
                                    <div class="form-group col-md-2">
                                        <label >Zip</label>
                                        <input onChange={this.zipCodeHandler} placeholder="12345" name="restaurantZip" type="number" class="form-control" id="inputZip" required />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="gridCheck" required />
                                        <label class="form-check-label">
                                            I Accept the terms and conditions
                                            </label>
                                    </div>
                                </div>
                                <div className="formholder">
                                    <button type="submit" onClick={this.signup} class="btn btn-primary">Sign up</button><br />
                                    <label>Already registered? <a href="/login">Login Here </a></label>
                                    <p>Need an Buyer account? <a href="/sign-up">Sign Up here</a></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default OwnerSignup;