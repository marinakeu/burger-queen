import React from 'react';
import logoVert from '../assets/img/logo-vertical.png';
import firebase from '../firebaseConfig';
import { Button, Form, Container, Tabs, Tab } from 'react-bootstrap';

const database = firebase.firestore();

class Pedidos extends React.Component {
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
                newState.orders = Object.values(data)
                this.setState(newState);
            })

        database.collection("orders").doc(date)
            .onSnapshot((doc) => {
                let data = doc.data();
                const newState = this.state;
                newState.orders = Object.values(data)
                this.setState(newState);
            });
    }


    goBack = () => {
        this.props.history.push('/cozinha');
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
                            return <div key={i} className="Order">
                                <div className="Display-flex-space info-bg padding-1">
                                    <p>Cliente: {order.clientName}</p>
                                    <p>Nº: {order.orderNumber}</p>
                                </div>
                                {order.order.map((product, i) => {
                                    return <div key={i}>
                                        <p>{product.quantidade} {product.nome}</p>
                                    </div>
                                })}
                                
                            </div>
                        })
                    }
                </div>
            </div >
        );
    }
}

export default Pedidos;