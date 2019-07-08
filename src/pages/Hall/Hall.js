import React from 'react';
import './Hall.css';
import firebase from '../../firebaseConfig';
import logoVert from '../../assets/img/logo-vertical.png';
import trash from '../../assets/img/trash.png'
import { Button, Tab, Tabs, InputGroup, FormControl } from 'react-bootstrap';

const firebaseAppAuth = firebase.auth();
const database = firebase.firestore();

const date = new Date().getFullYear() + "." + (new Date().getMonth() + 1) + "." + new Date().getDate();


const products = [
  {
    productName: "CAFÉ AMERICANO",
    productPrice: 5,
    productType: "manhã"
  },
  {
    productName: "CAFÉ COM LEITE",
    productPrice: 7,
    productType: "manhã"
  },
  {
    productName: "SANDUÍCHE DE PRESUNTO E QUEIJO",
    productPrice: 10,
    productType: "manhã"
  },
  {
    productName: "SUCO DE FRUTA NATURAL",
    productPrice: 7,
    productType: "manhã"
  },
  {
    productName: "HAMBÚRGUER SIMPLES",
    productPrice: 10,
    productType: "dia"
  },
  {
    productName: "HAMBÚRGUER DUPLO",
    productPrice: 15,
    productType: "dia"
  },
  {
    productName: "BATATA FRITA",
    productPrice: 5,
    productType: "dia"
  },
  {
    productName: "ANÉIS DE CEBOLA",
    productPrice: 5,
    productType: "dia"
  },
  {
    productName: "ÁGUA 500ml",
    productPrice: 5,
    productType: "dia"
  },
  {
    productName: "ÁGUA 750ml",
    productPrice: 7,
    productType: "dia"
  },
  {
    productName: "BEBIDA GASEIFICADA 500ml	",
    productPrice: 7,
    productType: "dia"
  },
  {
    productName: "BEBIDA GASEIFICADA 750ml",
    productPrice: 10,
    productType: "dia"
  }
]

class Hall extends React.Component {
  constructor(props) {
    super(props);
    this.sendOrder = this.sendOrder.bind(this);
    this.state = {
      orderItems: [],
      client: "",
      atendentName: "",
      orderNumber: 0,
      userIsLoggedIn: ""
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) this.handleChange(undefined, "userIsLoggedIn", true);
    });

    database.collection("orders").doc(date)
      .onSnapshot((doc) => {
        let data = doc.data();
        if (data) {
          let index = Object.values(data).length - 1;
          let number = Object.values(data)[index].orderNumber;
          this.handleChange(undefined, "orderNumber", number);
        }
      });
  }

  handleChange = (event, element, value) => {
    const newState = this.state;
    event ? newState[element] = event.target.value : newState[element] = value;
    this.setState(newState);
  }

  signOut = () => {
    firebase.auth().signOut().then(() => {
      this.props.history.push('/');
    })
      .catch(function (error) {
        console.log("An error happened");
      });
  }

  clickToBuy = (item) => {
    const itemIndex = this.state.orderItems.findIndex((product) => {
      return product.productName === item.productName;
    });

    if (itemIndex < 0) {
      const newItem = {
        ...item,
        quantity: 1
      };
      this.setState({
        orderItems: this.state.orderItems.concat(newItem)
      });
    } else {
      let newQuantity = this.state.orderItems;
      newQuantity[itemIndex].quantity += 1;
      this.setState({
        orderItems: newQuantity
      })
    };
  }

  clickToDelete = (item) => {
    const itemIndex = this.state.orderItems.findIndex((product) => {
      return product.productName === item.productName;
    });

    let newQuantity = this.state.orderItems;
    newQuantity[itemIndex].quantity -= 1;
    const quantity = newQuantity[itemIndex].quantity;

    if (quantity > 0) {
      this.setState({
        orderItems: newQuantity
      });
    } else {
      newQuantity.splice(itemIndex, 1);
      this.setState({
        orderItems: newQuantity
      })
    }
  }

  sendOrder = () => {
    let hour = new Date().getTime();
    let userId = firebaseAppAuth.currentUser.uid;
    database.collection("users").doc(userId).get()
      .then((doc) => {
        this.handleChange(undefined, "atendentName", doc.data().name);
        this.handleChange(undefined, "orderNumber", this.state.orderNumber + 1);
      })
      .then(() => {
        database.collection("orders").doc(date).set({
          [hour]: {
            id: hour,
            orderNumber: this.state.orderNumber,
            clientName: this.state.client,
            atendentName: this.state.atendentName,
            order: this.state.orderItems,
            moment: new Date(),
            ready: false,
            delivered: false
          }
        }, { merge: true })
      })
      .then(() => {
        this.handleChange(undefined, "orderItems", []);
        this.handleChange(undefined, "client", "");
      })
  }

  goDeliveries = () => {
    this.props.history.push('/entregas');
  }

  render() {
    const totalAmount = this.state.orderItems.reduce((acc, cur) => {
      return acc + (cur.quantity * cur.productPrice)
    }, 0);

    return (
      <div>
        <header className="White-bg Blue-border Margin-bottom-1 Display-flex-space">
          <div className="Width-30"></div>
          <div>
            <img className="Img-logo-salao Width-30" src={logoVert} alt="Logo" />
          </div>
          <div className="Width-30">
            <Button className="Margin-05" variant="dark" onClick={this.goDeliveries}>ENTREGAS</Button>
            <Button className="Margin-05" variant="dark" onClick={this.signOut}>SAIR</Button>
          </div>
        </header>
        <section className="Display-flex-start">
          <div className='Half-screen'>
            <Tabs className="Display-flex-center" defaultActiveKey="profile" id="uncontrolled-tab-example">
              <Tab className="White-border White-bg Padding-top-bottom-1" eventKey="profile" title="CAFÉ DA MANHÃ">
                {products.map((product, i) => {
                  return product.productType === 'manhã' ?
                    <Button className="Font-bold White-text Margin-05" variant="info" key={i}
                      onClick={() => this.clickToBuy(product)}>
                      {product.productName}<br></br>R$ {product.productPrice}</Button> : console.log()
                })}
              </Tab>
              <Tab className="White-border White-bg Padding-top-bottom-1" eventKey="home" title="TARDE/NOITE">
                {products.map((product, i) => {
                  return product.productType === 'dia' ?
                    <Button className="Font-bold White-text Margin-05" variant="info" key={i}
                      onClick={() => this.clickToBuy(product)}>
                      {product.productName}<br></br>R$ {product.productPrice}</Button> : console.log()
                })}
              </Tab>
            </Tabs>
          </div>
          <div className='Half-screen White-bg Padding-top-bottom-1 Red-text Font-bold'>
            <InputGroup className="Margin-13">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1" className="White-text Info-bg Font-bold" >CLIENTE</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder=""
                aria-label="client-name"
                aria-describedby="basic-addon1"
                value={this.state.client}
                onChange={(e) => this.handleChange(e, "client")} />
            </InputGroup>
            <div className="Grid-container">
              <p className="Grid-p1 Red-border-bottom Red-border-right Red-border-top">PRODUTO</p>
              <p className="Grid-p2 Red-border-bottom Red-border-right Red-border-top">UN</p>
              <p className="Grid-p3 Red-border-bottom Red-border-right Red-border-top">QTD</p>
              <p className="Grid-p4 Red-border-bottom Red-border-top">TT</p>
              <p className="Grid-p5 Red-border-bottom Red-border-top">  </p>
            </div>
            {this.state.orderItems.map((product, i) => {
              return <div key={i} className="Grid-container Red-border">
                <p className="Grid-p1 Red-border-bottom Red-border-right">{product.productName}</p>
                <p className="Grid-p2 Red-border-bottom Red-border-right">R$ {product.productPrice}</p>
                <p className="Grid-p3 Red-border-bottom Red-border-right">{product.quantity}</p>
                <p className="Grid-p4 Red-border-bottom">R$ {product.productPrice * product.quantity}</p>
                <p className="Grid-p5 Red-border-bottom"><button className="Transparent-bg" onClick={() => this.clickToDelete(product)}>
                  <img className="Trash-img" src={trash} alt="trash-icon" /></button></p>
              </div>
            })}
            <div className="Display-flex-center">
              <Button variant="dark" onClick={this.sendOrder}>FECHAR PEDIDO</Button>
              <p className="Margin-13">TOTAL: R$ {totalAmount}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default Hall;