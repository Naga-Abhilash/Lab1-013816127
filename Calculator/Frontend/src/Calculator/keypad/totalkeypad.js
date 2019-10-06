import React from "react";
import KeyRow from "./keyrow";
import Button from "../../components/button";
import LargeButton from "../../components/largebutton";


const TotalKeypad = (props) => (
  <section className="total-keypad">
    <KeyRow>
      <Button handleclick={props.handleclick} >C</Button>
      <Button handleclick={props.handleclick} > &larr; </Button>
      <Button handleclick={props.handleclick}>%</Button>
      <Button handleclick={props.handleclick}>/</Button>
    </KeyRow>
    <KeyRow>
      <Button handleclick={props.handleclick}>9</Button>
      <Button handleclick={props.handleclick}>8</Button>
      <Button handleclick={props.handleclick}>7</Button>
      <Button handleclick={props.handleclick}>*</Button>
    </KeyRow>
    <KeyRow>
      <Button handleclick={props.handleclick}>6</Button>
      <Button handleclick={props.handleclick}>5</Button>
      <Button handleclick={props.handleclick}>4</Button>
      <Button handleclick={props.handleclick}>-</Button>
    </KeyRow>
    <KeyRow>
      <Button handleclick={props.handleclick}>3</Button>
      <Button handleclick={props.handleclick}>2</Button>
      <Button handleclick={props.handleclick}>1</Button>
      <Button handleclick={props.handleclick}>+</Button>
    </KeyRow>
    <KeyRow>
      <Button handleclick={props.handleclick}>0</Button>
      <Button handleclick={props.handleclick}>.</Button>
      <LargeButton evaluate = {props.evaluate}>=</LargeButton>
    </KeyRow>
  </section>
);

export default TotalKeypad;
