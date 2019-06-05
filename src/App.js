import React from 'react';
import './App.css';
import Login from './pages/Login';
import Salao from './pages/Salao';
import Cozinha from './pages/Cozinha';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';


function App() {
  return (
    <Router>
      <div>
        <header className="App-header">
          <Route path="/" exact component={Login} />
          <Route path="/salao" component={Salao} />
          <Route path="/cozinha" component={Cozinha} />
        </header>
      </div>
    </Router>
  );
}

export default App;
