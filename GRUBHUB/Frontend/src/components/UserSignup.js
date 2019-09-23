import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar';

class Signup extends Component {

    constructor() {
        super();

        this.state = {
            FullName: "",
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
        this.phoneNumberHandler = this.phoneNumberHandler.bind(this);
        this.emailHandler = this.emailHandler.bind(this);
        this.passwordHandler = this.passwordHandler.bind(this);
        this.zipCodeHandler = this.zipCodeHandler.bind(this);
        this.addressHandler = this.addressHandler.bind(this);
        this.signup = this.signup.bind(this);
    }

    fullNameHandler = (e) => {
        this.setState({
            FullName: e.target.value
        })
    }


    phoneNumberHandler = (e) => {
        this.setState({
            PhoneNumber: e.target.value
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
    zipCodeHandler = (e) => {
        this.setState({
            ZipCode: e.target.value
        })
    }
    addressHandler = (e) => {
        this.setState({
            Address: e.target.value
        })
    }

    signup = (e) => {

        if (this.state.FullName == "" || this.state.PhoneNumber == "" || this.state.Email == "" || this.state.Password == "" || this.state.ZipCode == "" || this.state.Address == "") {
            this.setState({
                validationError: true
            });
        }

        else {


            var data = {
                FullName: this.state.FullName,
                PhoneNumber: this.state.PhoneNumber,
                Email: this.state.Email,
                Password: this.state.Password,
                Address: this.state.Address,
                ZipCode: this.state.ZipCode
            }

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
                    <div className="container content">
                        <div className="login-container">
                            <form>
                                <div>
                                    <p>Sign up for Grubhub</p>

                                </div>

                                <h3>Please provide your details:</h3>

                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputEmail4">Email</label>
                                        <input onChange={this.emailHandler} name="userEmail" type="email" class="form-control" id="inputEmail4" placeholder="Email" required />
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="inputPassword4">Password</label>
                                        <input onChange={this.passwordHandler} name="userpassword" type="password" class="form-control" id="inputPassword4" placeholder="Password" required />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="inputAddress">Your Full name:</label>
                                    <input onChange={this.fullNameHandler} name="userFullName" type="text" class="form-control" id="inputAddress" placeholder="Ex: Mary Smith" required />
                                </div>
                                <div class="form-group">
                                    <label for="inputAddress2">Address</label>
                                    <input onChange={this.addressHandler} name="userAddress" type="text" class="form-control" id="inputAddress2" placeholder="1234 Main St, Apt, studio, or floor" required />
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputNumber">Phone Number</label>
                                        <input onChange={this.phoneNumberHandler} name="userPhone" type="text" pattern="[0-9]{10}" class="form-control" id="inputNumber" required />
                                    </div>

                                    <div class="form-group col-md-2">
                                        <label for="inputZip">Zip</label>
                                        <input onChange={this.zipCodeHandler} name="userZip" type="number" class="form-control" id="inputZip" required />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="gridCheck" required />
                                        <label class="form-check-label" for="gridCheck">
                                            I Accept the terms and conditions
                                </label>
                                    </div>
                                </div>
                                <div className="formholder">
                                    <button type="submit" class="btn btn-primary" onClick={this.signup}>Sign UP</button>
                                    <p>Already have an account? <a href="/login">Login</a></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Signup;