import React, { Component } from 'react';
import './homestyle.css';
import { Redirect } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'


class Home extends Component {
    constructor(){
        super()
        this.state = {
            itemSearch: ""
        }
        this.searchHandle = this.searchHandle.bind(this);
    }

    searchHandle = event => {
        this.setState({
            itemSearch: event.target.value
        });
        console.log(this.state.itemSearch);
    }

    render() {
        let redirecetVar = null
        if (!localStorage.getItem('email')) {
            redirecetVar = <Redirect to='/login' />
        }
        return (
            <div >
                
                {redirecetVar}
                <Navbar />
                <div className="centerit">
                <div className="col-12 col-md-10 col-lg-8">
                    <form className="card card-sm">
                        <div className="card-body row no-gutters align-items-center">
                            <div >
                            </div>
                            <div className="col">
                                <input onChange = {this.searchHandle} className="form-control form-control-lg form-control-borderless" type="search" placeholder="Search food items"/>
                            </div>
                            <div className="col-auto">
                                <button className="btn btn-lg btn-success" type="submit">Search</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        );
    }
}

export default Home;
