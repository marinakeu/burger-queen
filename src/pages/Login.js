import React from 'react';
import LoginButton from './components/LoginButton';
import logo from '../../assets/img/logo.png';
import firebase from '../firebaseConfig';
import withFirebaseAuth from 'react-with-firebase-auth';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';

const firebaseAppAuth = firebase.auth();

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      senha: ""
    };
  }

  handleChange = (event, element) => {
    const newState = this.state;
    newState[element] = event.target.value
    this.setState(newState);
  }

  createUser = () => {
    this.props.createUserWithEmailAndPassword(this.state.email, this.state.senha);
    console.log(this.state.email);
    console.log(this.state.senha);
  };

  signIn = () => {
    this.props.signInWithEmailAndPassword(this.state.email, this.state.senha)
      .then(() => {
        console.log(this.props);
        alert("uhul");
      });
  };

  render() {
    return (
      <div>
        <img src={logo} alt="Logo" />;
        <input value={this.state.email}
          placeholder="email"
          onChange={(e) => this.handleChange(e, "email")} />
        <input value={this.state.senha}
          placeholder="senha"
          onChange={(e) => this.handleChange(e, "senha")} />
        <LoginButton text="criar usuário" onClick={this.createUser} />
        <LoginButton text="loga com usuario" onClick={this.signIn} />
      </div>
    );
  }
}

export default withFirebaseAuth({
  firebaseAppAuth,
})(Login);