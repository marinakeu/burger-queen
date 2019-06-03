import React from 'react';
import './App.css';
import Login from './pages/Login';
import Salao from './pages/Salao';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Route path="/" exact component={Login} />
          <Route path="/salao" component={Salao} />
        </header>
      </div>
    </Router>
  );
}

export default App;
