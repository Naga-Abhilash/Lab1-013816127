import React from "react";
import axios from 'axios'
import Screen from "./screen/Screen.js";
import TotalKeypad from "./keypad/totalkeypad";

class calculator extends React.Component {
  state = {
    equation: "",
    result: 0
  }

  handleclick = (e) => {
    let equation = this.state.equation;
    const pressedButton = e.target.innerHTML;
    console.log(pressedButton);

    if (pressedButton === 'C') {
      return this.clear();
    }
    else if ((pressedButton >= '0' && pressedButton <= '9') || pressedButton === '.') {
      equation += pressedButton;
    }
    else if (['+', '-', '*', '/', '%'].indexOf(pressedButton) !== -1) {
      equation += ' ' + pressedButton + ' ';
    }
    else {
      equation = equation.trim();
      equation = equation.substr(0, equation.length - 1);
    }
    this.setState({
      equation: equation
    })

  }


  clear = () => {
    this.setState({
      equation: "",
      result: 0
    })
  }
  evaluate = () => {
    console.log("evaluate method");

    const data = {
      expression: this.state.equation
    }
    console.log(data);
    axios.post('http://localhost:3010/calculate', data).then(response => {
      console.log(response.data);
      this.setState({
        result: response.data,
        equation: ""
      })
    })
  }

  render() {
    return (
      <main className="calculator">
        <Screen equation={this.state.equation} result={this.state.result} />
        <TotalKeypad handleclick={this.handleclick} evaluate={this.evaluate} />
      </main>
    );
  }
}

export default calculator;
