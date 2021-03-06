import React from 'react';
import './Kitchen.css';
import firebase from '../../firebaseConfig';
import logoVert from '../../assets/img/logo-vertical.png';
import { Button } from 'react-bootstrap';

const database = firebase.firestore();
const date = new Date().getFullYear() + "." + (new Date().getMonth() + 1) + "." + new Date().getDate();

class Kitchen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: []
    };
  }

  componentDidMount() {
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
    }).then(() => {
      this.props.history.push('/');
    })
      .catch(function (error) {
        console.log("An error happened");
      });
  }

  clickReady = (item) => {
    database.collection("orders").doc(date).set({
      [item.id]: {
        ready: true
      }
    }, { merge: true })
  }

  goAllOrders = () => {
    this.props.history.push('/pedidos');
  }

  render() {
    return (
      <div>
        <header className="White-bg Blue-border Margin-bottom-1 Display-flex-space">
          <div className="Width-30"></div>
          <div>
            <img className="Img-logo-salao Width-30" src={logoVert} alt="Logo" />
          </div>
          <div className="Width-30">
            <Button className="Margin-05" variant="dark" onClick={this.goAllOrders}>TODOS OS PEDIDOS</Button>
            <Button className="Margin-05" variant="dark" onClick={this.signOut}>SAIR</Button>
          </div>
        </header>
        <main className="Order-container Red-text Font-bold Margin-05">
          {this.state.orders.map((order, i) => {
            return !order.ready ?
              <section key={i} className="Order White-bg Margin-05">
                <header className="Display-flex-space Info-bg White-text Font-bold Padding-02">
                  <p>Cliente: {order.clientName}</p>
                  <p>Nº: {order.orderNumber}</p>
                </header>
                {order.order.map((product, i) => {
                  return <div key={i}>
                    <p>{product.quantity} {product.productName}</p>
                  </div>
                })}
                <Button className="Margin-05" variant="dark" onClick={() => this.clickReady(order)}>
                  PRONTO</Button>
              </section> : console.log()
          })}
        </main>
      </div>
    );
  }
}

export default Kitchen;