import React from "react";
import KeyRow from "./keyrow";
import Button from "../../components/button";
import LargeButton from "../../components/largebutton";

const TotalKeypad = () => (
  <section className="total-keypad">
    <KeyRow>
      <Button>c</Button>
      <Button> &larr; </Button>
      <Button>%</Button>
      <Button>/</Button>
    </KeyRow>
    <KeyRow>
      <Button>9</Button>
      <Button>8</Button>
      <Button>7</Button>
      <Button>*</Button>
    </KeyRow>
    <KeyRow>
      <Button>6</Button>  
      <Button>5</Button>
      <Button>4</Button>
      <Button>-</Button>
    </KeyRow>
    <KeyRow>
      <Button>3</Button>
      <Button>2</Button>
      <Button>1</Button>
      <Button>+</Button>
    </KeyRow>
    <KeyRow>
      <Button>0</Button>
      <Button>.</Button>
      <LargeButton>=</LargeButton>
    </KeyRow>
  </section>
);

export default TotalKeypad;
