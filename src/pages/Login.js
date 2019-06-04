import React from 'react';
import logo from '../assets/img/logo.png';
import firebase from '../firebaseConfig';
import withFirebaseAuth from 'react-with-firebase-auth';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Button, Form, Container, Tabs, Tab } from 'react-bootstrap';

const firebaseAppAuth = firebase.auth();
const database = firebase.firestore();

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.createUser = this.createUser.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.state = {
      displayName: "",
      email: "",
      password: "",
      role: "",
      isLoggedIn: false
    };
  }

  handleChange = (event, element) => {
    const newState = this.state;
    newState[element] = event.target.value
    this.setState(newState);
  }

  handleRedirect(user) {
console.log('oi')
console.log(user.uid);
this.setState({isLoggedIn: true});
  }

  createUser() {
    if (this.state.role === "Salão" || this.state.role === "Cozinha") {
      this.props.createUserWithEmailAndPassword(this.state.email, this.state.password, this.state.displayName)
      console.log(this.props);
      console.log(this.props.user.uid)
      // database.collection("users").doc(uid).update({
      //   displayName: 'marina',
      //   role: 'Cozinha'
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          console.log('tem user');      
          handleRedirect(user);             

        } else {
          console.log("User is signed out.")
        }
      });
      
    } else {
      alert('insira');
    }
  };

  signIn = () => {
    this.props.signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        console.log(this.props);
        alert("uhul");
      });
  };

  render() {
    const isLoggedIn = this.state.isLoggedIn;
   
    return (
      <div>
        <Container className="Text-align Display-flex Full-size">
          <img className="Logo-img" src={logo} alt="Logo" />
          <div>
            <Tabs className="Display-flex" defaultActiveKey="profile" id="uncontrolled-tab-example">
              <Tab className="White-border Tab-box" eventKey="profile" title="LOGIN">
                <Form>
                  <Form.Group controlId="formBasicEmailLogin">
                    <Form.Control size="lg" value={this.state.email} type="email"
                      placeholder="e-mail"
                      onChange={(e) => this.handleChange(e, "email")} />
                  </Form.Group>
                  <Form.Group controlId="formBasicPasswordLogin">
                    <Form.Control size="lg" value={this.state.password} type="senha"
                      placeholder="senha"
                      onChange={(e) => this.handleChange(e, "password")} />
                  </Form.Group>
                </Form>
                <div>
                  <Button variant="dark" size="lg" onClick={this.signIn}>Entrar</Button>
                </div>
              </Tab>
              <Tab className="White-border Tab-box" eventKey="home" title="CADASTRO">
                <Form>
                  <Form.Group controlId="formBasicNameSignUp">
                    <Form.Control size="lg" value={this.state.displayName} type="text"
                      placeholder="nome"
                      onChange={(e) => this.handleChange(e, "displayName")} />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmailSignUp">
                    <Form.Control size="lg" value={this.state.email} type="email"
                      placeholder="e-mail"
                      onChange={(e) => this.handleChange(e, "email")} />
                  </Form.Group>
                  <Form.Group controlId="formBasicPasswordSignUp">
                    <Form.Control size="lg" value={this.state.senha} type="password"
                      placeholder="senha"
                      onChange={(e) => this.handleChange(e, "password")} />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Control className="Grey-text" size="lg" as="select"
                      value={this.state.role}
                      onChange={(e) => this.handleChange(e, "role")} >
                      <option>escolha uma função</option>
                      <option>Salão</option>
                      <option>Cozinha</option>
                    </Form.Control>
                  </Form.Group>
                </Form>
                <div>
                  <Button variant="dark" size="lg" onClick={this.createUser}>Cadastrar</Button>
                </div>
              </Tab>
            </Tabs>
          </div>
        </Container>        
        {isLoggedIn ? <Redirect to="/Salao"/> : <span>oi</span>}
    
      </div >
    );
  }
}

export default withFirebaseAuth({
  firebaseAppAuth,
})(Login);