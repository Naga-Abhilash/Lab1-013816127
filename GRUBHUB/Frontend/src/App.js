import React, { Component } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Main from './components/main'
import 'bootstrap/dist/css/bootstrap.css';
import './styles/styles.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header >
          <BrowserRouter>
            <div>
              <Main />
            </div>
          </BrowserRouter>
        </header>
      </div>
    )
  }
}

export default App;
