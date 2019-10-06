import React from "react";

const button = props => <button onClick ={props.handleclick} className="btn">{props.children}</button>;

export default button;
