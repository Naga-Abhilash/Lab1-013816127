import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
// import logo from '../../images/login-page-burger.png'
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address format")
        .required("Email is required"),
    password: Yup.string()
        .required("Password is required")
});

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            authFlag: 'false'
        };

        this.submitLogin = this.submitLogin.bind(this);
    }

    submitLogin = (details) => {
        console.log("Inside submit login", details);
        const data = {
            userEmail: details.email,
            userPassword: details.password
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/login', data)
            .then(response => {
                console.log("inside success")
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("response", response.data)
                    localStorage.setItem("accountType", response.data)
                    localStorage.setItem("userEmail", data.userEmail)
                    this.setState({
                        authFlag: true
                    })
                    // alert("success")
                    // console.log(response)
                }
                console.log(this.state.authFlag)
            })
            .catch(error => {
                console.log("In error");
                this.setState({
                    authFlag: "false"
                });
                console.log(error);
                alert("User credentials not valid. Please try again!");
            })
    }


    render() {
        // console.log("test cookie",cookie.load('username-localhost-8888'))
        let redirectVar = null;
        if (cookie.load('cookie')) {
            // if(this.state.authFlag===true){

            // if (localStorage.getItem("accountType") === "2") {
            //     redirectVar = <Redirect to="/ownerhome" />
            // }
            if (localStorage.getItem("accountType") === "1") {
                redirectVar = <Redirect to="/" />
            }
        }
        return (
            <div className="container-fluid">
                {redirectVar}
                <div className="row align-items-center h-100 ">
                    <div className="col-md-6-fluid">
                        <img  alt="" className="img-responsive fit-image" />
                    </div>
                    <div className="col-md-4 mx-auto">
                        <div className="card shadow p-3 mb-5 rounded">
                            <div className="card-body text-left" >
                                <h4 className="text-black text-left font-weight-bold">Sign in with your Grubhub <br />account</h4>
                                <br />
                                <Formik
                                    initialValues={this.state}
                                    validationSchema={LoginSchema}
                                    onSubmit={(values, actions) => {
                                        this.submitLogin(values)
                                        actions.setSubmitting(false);
                                    }}
                                >
                                    {({ touched, errors, isSubmitting }) => (
                                        <Form>
                                            <div className="form-group text-left">
                                                <label htmlFor="email">Email</label>
                                                <Field
                                                    type="email"
                                                    name="email"
                                                    // autofocus="true"
                                                    className={`form-control ${
                                                        touched.email && errors.email ? "is-invalid" : ""
                                                        }`}
                                                />
                                                <ErrorMessage
                                                    component="div"
                                                    name="email"
                                                    align="text-left"
                                                    className="invalid-feedback"
                                                />
                                            </div>

                                            <div className="form-group text-left">
                                                <label htmlFor="password">Password</label>
                                                <Field
                                                    type="password"
                                                    name="password"
                                                    className={`form-control ${
                                                        touched.password && errors.password ? "is-invalid" : ""
                                                        }`}
                                                />
                                                <ErrorMessage
                                                    component="div"
                                                    name="password"
                                                    className="invalid-feedback"
                                                />
                                            </div>
                                            <br />
                                            <button
                                                type="submit"
                                                id="signin"
                                                className="btn btn-primary"
                                            // disabled={!isSubmitting}
                                            >
                                                {/* {isSubmitting ? "Please wait..." : "Sign in"} */}
                                                Sign in
                                                </button>
                                        </Form>
                                    )}
                                </Formik>

                                <br />
                                Don't have an account?&nbsp;&nbsp;<Link to="/customersignup">Create your customer account!</Link>
                                <br />
                                Want to partner with us?&nbsp;<Link to="/ownersignup">Create your owner account!</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default LoginForm;


