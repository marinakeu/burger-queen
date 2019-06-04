import React from 'react';
import LoginButton from './components/LoginButton';
import logo from '../assets/img/logo.png';
import firebase from '../firebaseConfig';
import withFirebaseAuth from 'react-with-firebase-auth';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Button, Form, Container, Modal, ButtonToolbar, Tabs, Tab, Nav } from 'react-bootstrap';
import MyVerticallyCenteredModal from './components/MyVerticallyCenteredModal';

const firebaseAppAuth = firebase.auth();

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      senha: "",

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
        <Container className="Text-align Display-flex Full-size">
          <img className="Logo-img" src={logo} alt="Logo" />
          <div>
            <Tabs className="Display-flex" defaultActiveKey="profile" id="uncontrolled-tab-example">
              <Tab className="White-border" eventKey="home" title="LOGIN">
                <Form>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Control size="lg" value={this.state.email} type="email"
                      placeholder="e-mail"
                      onChange={(e) => this.handleChange(e, "email")} />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Control size="lg" value={this.state.senha} type="password"
                      placeholder="senha"
                      onChange={(e) => this.handleChange(e, "senha")} />
                  </Form.Group>
                </Form>
                <div className="Display-flex">
                  <Button variant="light" size="lg" onClick={this.signIn}>Entrar</Button>
                </div>
              </Tab>
              <Tab className="White-border" eventKey="profile" title="CADASTRO">
                <div>
                  <Button variant="dark" size="lg" onClick={this.createUser}>Cadastrar</Button>
                </div>
              </Tab>
            </Tabs>
          </div>
        </Container>
      </div >
    );
  }
}

export default withFirebaseAuth({
  firebaseAppAuth,
})(Login);