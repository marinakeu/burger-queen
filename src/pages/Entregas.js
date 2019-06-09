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

    render() {
        console.log(this.state)
        return (
            <div>
                <header className="header-salao Display-flex-space">
                    <div className="width-33"></div>
                    <div>
                        <img className="Logo-img-salao width-33" src={logoVert} alt="Logo" />
                    </div>
                    <div className="width-33">
                        <Button className="margin-0" variant="dark" onClick={this.goBack}>VOLTAR</Button>
                        <Button className="margin-0" variant="dark" onClick={this.signOut}>SAIR</Button>
                    </div>
                </header>

                <div className="Order-div red-text">
                    {
                        this.state.orders.map((order, i) => {
                            return order.ready & !order.delivered ?
                                <div key={i} className="Order">
                                    <div className="Display-flex-space info-bg padding-1">
                                        <p>Cliente: {order.clientName}</p>
                                        <p>Nº: {order.orderNumber}</p>
                                    </div>
                                    {order.order.map((product, i) => {
                                        return <div key={i}>
                                            <p>{product.quantidade} {product.nome}</p>
                                        </div>
                                    })}
                                    <Button className="margin-0" variant="dark" onClick={() => this.cliqueEntregue(order)}>
                                        ENTREGUE</Button>
                                </div> : console.log()
                        })
                    }
                </div>
            </div >
        );
    }
}

export default Entregas;