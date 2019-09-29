
import React, { Component } from 'react';
import './cardstyles.css';
import {Redirect} from 'react-router-dom'

var images = require.context('../../images', true);
let redirectVar = null;
class restCard extends Component {
    constructor(props) {
        super(props);
    }
   
    render() {
        let {restName, restImage, restDesc } = this.props.restIndividual;
        if (restImage === ""){
            restImage = "biryani.jpg"
        }
        let unknown = images(`./${restImage}`)
        
        return (
            <div>
                
                <div className= "restRight" >
                    <div className = "col-md-3 col-sm-6">
                        <div className="card cardclass" id={restName} >
                            <img src={unknown} className="card-img-top" alt="..."/>
                            <div className="card-block" id = "card-title-text">
                                <h4 className="card-title">{ restName}</h4>
                                <p className="card-text">{restDesc} </p>
                                <button id="btn-rest-visit" onClick={() => this.props.visitRest(this.props.restIndividual.restId)} className="btn btn-primary">Visit Restaurant</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default restCard;