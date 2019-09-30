import React from 'react';
import './restHome.css'

class AddCartPopup extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        console.log("in add to cart popup");
        let hek = "hello"
        return (
            <div >
                <div className = "bg-modal">
                    {hek}
                </div>
            </div>
        );
    }
}

export default AddCartPopup;