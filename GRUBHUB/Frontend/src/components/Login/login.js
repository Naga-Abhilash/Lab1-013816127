import React, { Component } from 'react';
import '../../styles/styles.css';
import { connect } from 'react-redux';
import { login } from '../reducers/AllReducers';
import store from '../store/store';
import Navbar from '../Navbar/Navbar'

//Define a Login Component
class userLogin extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {}
        //Bind the handlers to this class
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }

    //username change handler to update state variable with the text entered by the user
    usernameChangeHandler = (e) => {
        this.setState({
            username: e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    handleValidation() {
        let formIsValid = true;
        if (!this.state.username || !this.state.password) {
            formIsValid = false;
            alert("User name amd password is a Required field");
            console.log("User name cannot be empty");
        }
        return formIsValid;
    }

    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        console.log("Inside submit login");
        //prevent page from refresh
        e.preventDefault();
        if (this.handleValidation()) {
            console.log("all boxes filled")
            const data = {
                username: this.state.username,
                password: this.state.password
            }
            if (data.username && data.password) {
                console.log("inside this.props.login call")
                this.props.login(data.username, data.password)
            }

        }

    }
    render() {
        let { isLoginSuccess, loginError } = this.props;
        return (
            <div>
                <Navbar />
                <form className="form-group ">
                    <div className="login-container">
                        <div className="login-form-container col-lg-4 col-md-4 col-sm-12 offset-lg-4 offset-md-4 border">
                            <div className="login-form-heading input-group pad-top-10 input-group-lg">
                                Enter your credentials:
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(userLogin);


// //export Login Component
// export default userLogin;