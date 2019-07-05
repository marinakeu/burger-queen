import React from 'react';
import './App.css';
import Home from './pages/Home';
import Hall from './pages/Hall';
import Kitchen from './pages/Kitchen';
import Orders from './pages/Orders';
import Deliveries from './pages/Deliveries';
import {BrowserRouter as Router, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <header className="Red-bg Text-align Full-size">
          <Route path="/" exact component={Home} />
          <Route path="/salao" component={Hall } />
          <Route path="/cozinha" component={Kitchen} />
          <Route path="/pedidos" component={Orders} />
          <Route path="/entregas" component={Deliveries} />
        </header>
      </div>
    </Router>
  );
}

export default App;
