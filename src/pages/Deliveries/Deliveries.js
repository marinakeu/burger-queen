import React from 'react';
import './Deliveries.css';
import logoVert from '../../assets/img/logo-vertical.png';
import firebase from '../../firebaseConfig';
import { Button } from 'react-bootstrap';

const database = firebase.firestore();
const date = new Date().getFullYear() + "." + (new Date().getMonth() + 1) + "." + new Date().getDate();

class Deliveries extends React.Component {
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

  clickDelivered = (item) => {
    database.collection("orders").doc(date).set({
      [item.id]: {
        delivered: true
      }
    }, { merge: true })
  }

  goBackToHall = () => {
    this.props.history.push('/salao');
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
            <Button className="Margin-05" variant="dark" onClick={this.goBackToHall}>VOLTAR</Button>
            <Button className="Margin-05" variant="dark" onClick={this.signOut}>SAIR</Button>
          </div>
        </header>
        <main className="Order-container Red-text Font-bold Margin-05">
          {this.state.orders.map((order, i) => {
            return order.ready & !order.delivered ?
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
                <Button className="Margin-05" variant="dark" onClick={() => this.clickDelivered(order)}>
                  ENTREGUE</Button>
              </section> : console.log()
          })}
        </main>
      </div>
    );
  }
}

export default Deliveries;