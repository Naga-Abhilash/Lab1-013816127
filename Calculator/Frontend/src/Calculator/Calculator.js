import React from "react";

import Screen from "./screen/Screen.js";
import TotalKeypad from "./keypad/totalkeypad";

const calculator = () => (
  <main className="calculator">
    <Screen />
    <TotalKeypad />
  </main>
);

export default calculator;
