import React from 'react';
import logoVert from '../assets/img/logo-vertical.png';
import firebase from '../firebaseConfig';
import { Button } from 'react-bootstrap';

const database = firebase.firestore();

class Entregas extends React.Component {
  constructor(props) {
    super(props);
    // this.createUser = this.createUser.bind(this);
    this.state = {
      orders: []
    };
  }

  componentDidMount() {
    let date = new Date().getFullYear() + "." + (new Date().getMonth() + 1) + "." + new Date().getDate();
    database.collection("orders").doc(date).get()
      .then((doc) => {
        let data = doc.data();
        const newState = this.state;
        if (data) { newState.orders = Object.values(data) };
        this.setState(newState);
      })
    database.collection("orders").doc(date)
      .onSnapshot((doc) => {
        let data = doc.data();
        const newState = this.state;
        if (data) { newState.orders = Object.values(data) };
        this.setState(newState);
      });
  }

  signOut = () => {
    firebase.auth().signOut().then(function () {
      console.log("Sign-out successful");
    }).then(() => {
      this.props.history.push('/');
    })
      .catch(function (error) {
        console.log("An error happened");
      });
  }

  cliqueEntregue = (item) => {
    let date = new Date().getFullYear() + "." + (new Date().getMonth() + 1) + "." + new Date().getDate();
    console.log(item);
    let orderId = item.id;
    console.log(orderId);
    database.collection("orders").doc(date).set({
      [orderId]: {
        delivered: true
      }
    }, { merge: true })
  }

  goBack = () => {
    this.props.history.push('/salao');
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <header className="White-bg Blue-border Margin-bottom-1 Display-flex-space">
          <div className="Width-33"></div>
          <div>
            <img className="Img-logo-salao Width-33" src={logoVert} alt="Logo" />
          </div>
          <div className="Width-33">
            <Button className="Margin-05" variant="dark" onClick={this.goBack}>VOLTAR</Button>
            <Button className="Margin-05" variant="dark" onClick={this.signOut}>SAIR</Button>
          </div>
        </header>
        <div className="Order-container Red-text Font-bold Margin-05">
          {this.state.orders.map((order, i) => {
            return order.ready & !order.delivered ?
              <div key={i} className="Order White-bg Margin-05">
                <div className="Display-flex-space Info-bg White-text Font-bold Padding-02">
                  <p>Cliente: {order.clientName}</p>
                  <p>Nº: {order.orderNumber}</p>
                </div>
                {order.order.map((product, i) => {
                  return <div key={i}>
                    <p>{product.quantidade} {product.nome}</p>
                  </div>
                })}
                <Button className="Margin-05" variant="dark" onClick={() => this.cliqueEntregue(order)}>
                  ENTREGUE</Button>
              </div> : console.log()
          })}
        </div>
      </div >
    );
  }
}

export default Entregas;