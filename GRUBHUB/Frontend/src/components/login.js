import React, { Component } from 'react';
import {connect} from 'react-redux'
import Navbar from '../Navbar/Navbar';
import store from '../store/store'
import login from '../reducers/AllReducers'

class Login extends Component {


    constructor(props) {
        super(props);

        this.state = {}

        //Bind events
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }

    usernameChangeHandler = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    passwordChangeHandler = (e) => {
        this.setState({
            Password: e.target.value
        })
    }

    submitLogin = (e) => {
        e.preventDefault();

        if (this.state.username == "" || this.state.Password == "") {
            this.setState({
                formValidationFailure: true
            });
            console.log('Fill both the fields!');

        }
        else {
            const data = {
                username: this.state.username,
                password: this.state.password
            }
            this.props.login(data.username, data.password);
        }

    }

    render() {

        let formErrorPanel = null;
        console.log('FormvalidationFailure', this.state.formValidationFailure);
        if (this.state.formValidationFailure) {
            formErrorPanel = <div>
                <div className="alert alert-danger" role="alert">
                    <strong>Error!</strong> Username and Password are required!
                </div>
            </div>
        }
        let { isLoginPending, isLoginSuccess, loginError } = this.props;
        return (
            <div>
                <Navbar />
                <form className="form-group ">
                    <div className="login-container">
                        <div className="login-form-container col-lg-4 col-md-4 col-sm-12 offset-lg-4 offset-md-4 border">
                            <div className="login-form-heading input-group pad-top-10 input-group-lg">
                                Enter your credentials:
                            </div>
                            {formErrorPanel}
                            <div className="form-group">
                                <input type="username" name="username" id="username" className="form-control" placeholder="username" onChange={this.usernameChangeHandler} required />
                            </div>
                            <div className="form-group ">
                                <input type="password" name="password" id="password" className="form-control" placeholder="Password" onChange={this.passwordChangeHandler} required />
                            </div>
                            <div className="form-group ">
                                <a href="" className="">Forgot Password?</a>
                            </div>
                            <div>
                                <button className="btn btn-primary " onClick={this.submitLogin} >Login </button><br />
                                <p>Need an account? <a href="/usersignup">Sign Up</a></p>
                                <p>Need an Owner account? <a href="/ownersignup">Owner Sign Up</a></p>
                                <p><a href="/update-profile">update</a></p>
                            </div>
                            <div className="message">
                                {isLoginSuccess && <div>Success.</div>}
                                {loginError && <div>{loginError.message}</div>}
                                {store.username}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoginSuccess: state.isLoginSuccess,
        loginError: state.loginError
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (username, password) => dispatch(login(username, password))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
