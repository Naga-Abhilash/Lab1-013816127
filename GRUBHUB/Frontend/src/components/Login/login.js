import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { reduxForm } from 'redux-form';
import { submitLogin } from '../../redux/actions/index'
import Navbar from '../Navbar/Navbar'


class Login extends Component {
    constructor() {
        super();
        this.state = {
            Email: '',
            password: '',
            formValidationFailure: false,
            isValidationFailure: true,
        };
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange = e => {
        e.preventDefault()
        this.setState({
            [e.target.id]: e.target.value
        });
    }
    
    onSubmit(values) {
        //    axios.defaults.withCredentials = true;
        
            console.log("all fields filled")
            const data = {
                Email: this.state.Email,
                Password: this.state.password
            }
            console.log(this.state.Email);
            
            this.props.submitLogin(data);
        
    }

    render() {
        let redirectVar = null;
        console.log("logininstatestore", this.props.loginStateStore.result)
        if (this.props.loginStateStore.result) {
            if (this.props.loginStateStore.result.isAuthenticated === true) {
                redirectVar = <Redirect to="/" />
            }

        }
        let errorPanel = null;
        if (this.props.loginStateStore.result) {
            if (this.props.loginStateStore.result.isAuthenticated === false) {
                errorPanel = <div>
                    <div className="alert alert-danger" role="alert">
                        <strong>Validation Error!</strong> Email and Password doesn't match!
                </div>
                </div>
            }
        }
        let formErrorPanel = null;
        if (this.state.formValidationFailure) {
            formErrorPanel = <div>
                <div className="alert alert-danger" role="alert">
                    <strong>Validation Error!</strong> Email and Password are required!
                </div>
            </div>
        }
        const { handleSubmit } = this.props;
        return (
            <div>
                <Navbar />
                {redirectVar}
                <form className="form-group" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                    <div className="login-container">
                        
                        <div className="login-form-container col-lg-4 col-md-4 col-sm-12 offset-lg-4 offset-md-4 border">
                            {errorPanel}
                            {formErrorPanel}
                            <div className="login-form-heading input-group pad-top-10 input-group-lg">
                                Enter your credentials:
                            </div>
                            <div className="form-group">
                                <input type="Email" name="Email" id="Email" className="form-control" placeholder="Email" onChange={this.handleChange} required />
                            </div>
                            <div className="form-group ">
                                <input type="password" name="password" id="password" className="form-control" placeholder="Password" onChange={this.handleChange} required />
                            </div>
                            {/* <div className="form-group ">
                                <a href="" className="">Forgot Password?</a>
                            </div> */}
                            <div>
                                <button className="btn btn-primary" >Login </button><br />
                                <p>Need an account? <a href="/signup">Sign Up</a></p>
                                <p><a href="/update-profile">update</a></p>
                            </div>
                            <div className="message">
                                
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}


// export default Login;

//This method provides access to redux store
const mapStateToProps = state => ({
    loginStateStore: state.login
});

function validate(values) {
    const errors = {};
    if (!values.Email) {
        errors.Email = "Enter E-mail";
    }
    if (!values.password) {
        errors.password = "Enter Password";
    }
    return errors;
}

//export default Login;
export default reduxForm({
    validate,
    form: "loginForm"
})(connect(mapStateToProps, { submitLogin })(Login));


