import React from "react";

const LargeButton = props => <button onClick = {props.evaluate} className="large-btn">{props.children}</button>;

export default LargeButton;
