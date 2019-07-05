import React from 'react';
import firebase from '../firebaseConfig';
import logoVert from '../assets/img/logo-vertical.png';
import { Button } from 'react-bootstrap';

const database = firebase.firestore();

class Kitchen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: []
    };
  }

  componentDidMount() {
    let date = new Date().getFullYear() + "." + (new Date().getMonth() + 1) + "." + new Date().getDate();
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

  cliquePronto = (item) => {
    let date = new Date().getFullYear() + "." + (new Date().getMonth() + 1) + "." + new Date().getDate();
    console.log(item);
    let orderId = item.id;
    console.log(orderId);
    database.collection("orders").doc(date).set({
      [orderId]: {
        ready: true
      }
    }, { merge: true })
  }

  allOrders = () => {
    this.props.history.push('/pedidos');
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <header className="White-bg Blue-border Margin-bottom-1 Display-flex-space">
          <div className="Width-30"></div>
          <div>
            <img className="Img-logo-salao Width-30" src={logoVert} alt="Logo" />
          </div>
          <div className="Width-30">
            <Button className="Margin-05" variant="dark" onClick={this.allOrders}>TODOS OS PEDIDOS</Button>
            <Button className="Margin-05" variant="dark" onClick={this.signOut}>SAIR</Button>
          </div>
        </header>
        <div className="Order-container Red-text Font-bold Margin-05">
          {this.state.orders.map((order, i) => {
            return !order.ready ?
              <div key={i} className="Order White-bg Margin-05">
                <div className="Display-flex-space Info-bg White-text Font-bold Padding-02">
                  <p>Cliente: {order.clientName}</p>
                  <p>Nº: {order.orderNumber}</p>
                </div>
                {order.order.map((product, i) => {
                  return <div key={i}>
                    <p>{product.quantity} {product.productName}</p>
                  </div>
                })}
                <Button className="Margin-05" variant="dark" onClick={() => this.cliquePronto(order)}>
                  PRONTO</Button>
              </div> : console.log()
          })}
        </div>
      </div>
    );
  }
}

export default Kitchen;