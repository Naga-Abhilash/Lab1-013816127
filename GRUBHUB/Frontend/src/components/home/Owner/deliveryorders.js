import React, { Component } from "react";
// import NavBar from "../../Navbar/navbar";
import axios from 'axios'
import ItemDetails from "./itemdetails";
import rootUrl from "../../config/settings";

class DeliveryOrders extends Component{
    constructor(props){
        super(props)
        this.state={
          orders: []
      }
         this.handleOrder=this.handleOrder.bind(this)
    }
    
    componentDidMount(){
      console.log("Inside get order details afer component mount");
      axios.get(rootUrl+'/orders/all-orders')
          .then(response=>{
              if(response.status===200){
              console.log(response.data)
              this.setState({
                  orders: response.data
              })
              console.log("this state orders",typeof this.state.orders)
           }
          })
  }

  handleOrder(orderId){
    const data={
        orderId: orderId,
        orderStatus: "delivered"
    }
    console.log("data",data)
    axios.put(rootUrl+'/orders/manage-orders',data)
        .then(response => {
            console.log("inside success" )
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("response",response.data)
                alert("success")
                window.location.reload();
            }
        })
        .catch(error => {
            console.log("In error");
            console.log(error);
            // alert("User credentials not valid. Please try again!");
        })

}

    render(){
      let pastOrderDetails;
        
    pastOrderDetails = this.state.orders.map((order) => {
        // i=i+1;
        console.log("order status",order.userOrder[0].orderStatus)
        if(order.userOrder[0].orderStatus==="ready"){
            return (
                <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Customer name: {order.userOrder[0].userName} || Order Id: #{order.orderId}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Customer Address: {order.userOrder[0].userAddress}</h6>
                    <ItemDetails
                    itemsInOrder={order.userOrder}/>
                    <p className="card-text font-weight-bold text-muted">Order status: {order.userOrder[0].orderStatus}</p>
                    <p className="card-text font-weight-bold text-muted">Delivered? </p>
                    <button className="btn btn-outline-success" onClick= {() => this.handleOrder(order.orderId)}>Yes</button>
                </div>
                </div>
            )
            }
    })
    return(
        <div>
             
               {/* {UniqueOdrer} */}
               {pastOrderDetails}
            
        </div>
    )
}
}

export default DeliveryOrders;