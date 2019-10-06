
import React, { Component } from 'react';
import './cardstyles.css';
import {Redirect} from 'react-router-dom'
import axios from 'axios'
import logo from '../../images/login-page-burger.png'
import rootUrl from '../config/settings';

// var images = require.context('../../../../backend/uploads/', true);
let redirectVar = null;
class restCard extends Component {
    constructor(props) {
        super(props);
        this.state={
           photos: []
           }
    }

// componentDidMount(){
//     console.log("rest images",this.props.restIndividual)
//     var imageArr = [];
//     // var photoList = this.state.items.itemImage;
//    if(this.props.restIndividual.restImage){
//         console.log("image of restaurant",this.props.restIndividual.restImage)
//         axios.post('http://localhost:3001/download-file/' + this.props.restIndividual.restImage)
//             .then(response => {
//                 //console.log("Imgae Res : ", response);
//                 let imagePreview = 'data:image/jpg;base64, ' + response.data;
//                 imageArr.push(imagePreview);
//                 const photoArr = this.state.photos.slice();
//                 photoArr[i] = imagePreview;
//                 this.setState({
//                     photos: photoArr
//                 });

//                 console.log('PhotoArr: ', photoArr);
//                 console.log('Photo State: ', this.state.photos);
//             })
// }
// }
   
    render() {
        let {restId, restImage, restName, restDesc } = this.props.restIndividual;
        if (restImage === "" || restImage===null){
            restImage = "biryani.jpg"
        }
        let unknown =  rootUrl+'/profile/download-file/' + restImage
        // let profileImageData = <img src={logo} className="card-img-top" alt="..."/>
        // if (this.state.photos[this.props.key]) {
        //     profileImageData = <img src={this.state.photos[this.props.key]} className="card-img-top img-responsive fit-image" id="itemimage" alt="..."/>
        // }

        
        return (
            <div>
                
                <div className= "restRight" >
                    <div className = "col-md-3 col-sm-6">
                        <div className="card cardclass" id="cardclass" >
                            <img src={unknown} className="card-img-top" id="card-img-top" alt="..."/>
                            {/* {profileImageData} */}
                            <div className="card-block" id = "card-title-text">
                                <h4 className="card-title" id="card-title">{ restName}</h4>
                                <p className="card-text" id="card-text">{restDesc} </p>
                                <button id="btn-rest-visit" onClick={() => this.props.visitRest(restId)} className="btn btn-primary">Visit Restaurant</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default restCard;