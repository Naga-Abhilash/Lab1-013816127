import React, { Component } from 'react';

class LeftPanel extends Component {
    constructor(props){
        super(props)
    }
    
    render() {
        return (
            <div>
                <button onClick={() => this.props.visitCuisine(this.props.cuisineIndividual.cuisineName)} className="list-group-item list-group-item-action" >{this.props.cuisineIndividual.cuisineName} </button>
            </div>
        );
    }
}

export default LeftPanel;