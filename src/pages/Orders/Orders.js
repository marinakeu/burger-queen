import React from 'react';
import './Orders.css';
import logoVert from '../../assets/img/logo-vertical.png';
import firebase from '../../firebaseConfig';
import { Button } from 'react-bootstrap';

const database = firebase.firestore();
const date = new Date().getFullYear() + "." + (new Date().getMonth() + 1) + "." + new Date().getDate();

class Orders extends React.Component {
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

  goBackToKitchen = () => {
    this.props.history.push('/cozinha');
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
            <Button className="Margin-05" variant="dark" onClick={this.goBackToKitchen}>VOLTAR</Button>
            <Button className="Margin-05" variant="dark" onClick={this.signOut}>SAIR</Button>
          </div>
        </header>
        <div className="Order-container Red-text Font-bold Margin-05">
          {this.state.orders.map((order, i) => {
            return <div key={i} className="Order White-bg Margin-05">
              <div className="Display-flex-space Info-bg White-text Font-bold Padding-02">
                <p>Cliente: {order.clientName}</p>
                <p>Nº: {order.orderNumber}</p>
              </div>
              {order.order.map((product, i) => {
                return <div key={i}>
                  <p>{product.quantity} {product.productName}</p>
                </div>
              })}
              <p className="Grey-dark-text">PEDIDO {order.ready ? "PRONTO" : "PENDENTE"}
                {order.delivered ? " E ENTREGUE" : ""}</p>

            </div>
          })}
        </div>
      </div>
    );
  }
}

export default Orders;