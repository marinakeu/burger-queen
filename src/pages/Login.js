import React from 'react';
import logo from '../assets/img/logo.png';
import firebase from '../firebaseConfig';
import withFirebaseAuth from 'react-with-firebase-auth';
import { Button, Form, Container, Tabs, Tab } from 'react-bootstrap';

const firebaseAppAuth = firebase.auth();
const database = firebase.firestore();

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.createUser = this.createUser.bind(this);
    this.state = {
      name: "",
      role: "",
      emailSignUp: "",
      passwordSignUp: "",
      email: "",
      password: ""
    };
  }

  handleChange = (event, element) => {
    const newState = this.state;
    newState[element] = event.target.value
    this.setState(newState);
  }

  createUser() {
    if (this.state.role === "Salão" || this.state.role === "Cozinha") {
      this.props.createUserWithEmailAndPassword(this.state.emailSignUp, this.state.passwordSignUp, this.state.name)
        .then(() => {
          database.collection("users").doc(this.props.user.uid).set({
            name: this.state.name,
            role: this.state.role
          })

          if (this.props.user) {
            if (this.state.role === "Salão") {
              this.props.history.push('/salao');
            } else {
              this.props.history.push('/cozinha');
            }
          };
        })
    } else {
      alert('insira');
    }
  };

  signIn = () => {
    this.props.signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        if (this.props.user) {
          database.collection("users").doc(this.props.user.uid).get()
            .then((doc) => {
              let role = doc.data().role;
              if (role === "Salão") {
                this.props.history.push('/salao');
              } else {
                this.props.history.push('/cozinha');
              }
            })
        };
      });
  };

  render() {
    return (
      <div className='red-bg'>
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
                    <Form.Control size="lg" value={this.state.password} type="password"
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
                    <Form.Control size="lg" value={this.state.name} type="text"
                      placeholder="nome"
                      onChange={(e) => this.handleChange(e, "name")} />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmailSignUp">
                    <Form.Control size="lg" value={this.state.emailSignUp} type="email"
                      placeholder="e-mail"
                      onChange={(e) => this.handleChange(e, "emailSignUp")} />
                  </Form.Group>
                  <Form.Group controlId="formBasicPasswordSignUp">
                    <Form.Control size="lg" value={this.state.passwordSignUp} type="password"
                      placeholder="senha"
                      onChange={(e) => this.handleChange(e, "passwordSignUp")} />
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
      </div >
    );
  }
}

export default withFirebaseAuth({
  firebaseAppAuth,
})(Login);