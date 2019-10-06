import React from "react";
import EvaluationScreen from "./EvaluationScreen.js";
import ResultScreen from "./resultscreen.js";

const Screen = (props) => (
  <div className="screen">
    <ResultScreen>{props.result}</ResultScreen>
    <EvaluationScreen >{props.equation}</EvaluationScreen>
  </div>
);

export default Screen;
