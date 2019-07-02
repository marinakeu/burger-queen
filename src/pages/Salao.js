import React from 'react';
import firebase from '../firebaseConfig';
import logoVert from '../assets/img/logo-vertical.png';
import trash from '../assets/img/trash.png'
import { Button, Tab, Tabs, InputGroup, FormControl } from 'react-bootstrap';

const firebaseAppAuth = firebase.auth();
const database = firebase.firestore();

const produtos = [
  {
    nome: "CAFÉ AMERICANO",
    preco: 5,
    tipo: "manhã"
  },
  {
    nome: "CAFÉ COM LEITE",
    preco: 7,
    tipo: "manhã"
  },
  {
    nome: "SANDUÍCHE DE PRESUNTO E QUEIJO",
    preco: 10,
    tipo: "manhã"
  },
  {
    nome: "SUCO DE FRUTA NATURAL",
    preco: 7,
    tipo: "manhã"
  },
  {
    nome: "HAMBÚRGUER SIMPLES",
    preco: 10,
    tipo: "dia"
  },
  {
    nome: "HAMBÚRGUER DUPLO",
    preco: 15,
    tipo: "dia"
  },
  {
    nome: "BATATA FRITA",
    preco: 5,
    tipo: "dia"
  },
  {
    nome: "ANÉIS DE CEBOLA",
    preco: 5,
    tipo: "dia"
  },
  {
    nome: "ÁGUA 500ml",
    preco: 5,
    tipo: "dia"
  },
  {
    nome: "ÁGUA 750ml",
    preco: 7,
    tipo: "dia"
  },
  {
    nome: "BEBIDA GASEIFICADA 500ml	",
    preco: 7,
    tipo: "dia"
  },
  {
    nome: "BEBIDA GASEIFICADA 750ml",
    preco: 10,
    tipo: "dia"
  }
]

class Salao extends React.Component {
  constructor(props) {
    super(props);
    this.sendOrder = this.sendOrder.bind(this);
    this.state = {
      comprar: [],
      client: "",
      atendentName: "",
      orderNumber: 0
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log('Usário logado');
      } else {
        console.log("User is signed out.");
      }
    });
  }

  handleChange = (event, element) => {
    const newState = this.state;
    newState[element] = event.target.value
    this.setState(newState);
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

  cliqueDaCompra = (item) => {
    const itemIndex = this.state.comprar.findIndex((produto) => {
      return produto.nome === item.nome;
    });
    if (itemIndex < 0) {
      const newItem = {
        ...item,
        quantidade: 1
      };
      this.setState({
        comprar: this.state.comprar.concat(newItem)
      });
    } else {
      let newCompra = this.state.comprar;
      newCompra[itemIndex].quantidade += 1;
      this.setState({
        comprar: newCompra
      })
    };
  }

  cliqueDeleta = (item) => {
    const itemIndex = this.state.comprar.findIndex((produto) => {
      return produto.nome === item.nome;
    });
    let newCompra = this.state.comprar;
    newCompra[itemIndex].quantidade -= 1;
    const quantidade = newCompra[itemIndex].quantidade;
    if (quantidade > 0) {
      this.setState({
        comprar: newCompra
      });
    } else {
      newCompra.splice(itemIndex, 1);
      this.setState({
        comprar: newCompra
      })
    }
  }  

  sendOrder = () => {
    let date = new Date().getFullYear() + "." + (new Date().getMonth() + 1) + "." + new Date().getDate();
    let hour = new Date().getTime();
    let userId = firebaseAppAuth.currentUser.uid;
    database.collection("users").doc(userId).get()
      .then((doc) => {
        let name = doc.data().name;
        const newState = this.state;
        newState.atendentName = name;
        newState.orderNumber = this.state.orderNumber + 1;
        this.setState(newState);
      })
      .then(() => {
        database.collection("orders").doc(date).set({
          [hour]: {
            id: hour,
            orderNumber: this.state.orderNumber,
            clientName: this.state.client,
            atendentName: this.state.atendentName,
            order: this.state.comprar,
            moment: new Date(),
            ready: false,
            delivered: false
          }
        }, { merge: true })
      })
      .then(() => {
        const newState = this.state;
        newState.comprar = [];
        newState.client = "";
        this.setState(newState);
      })
  }

  deliver = () => {
    this.props.history.push('/entregas');
  }

  render() {
    const valorTotal = this.state.comprar.reduce((acc, cur) => {
      return acc + (cur.quantidade * cur.preco)
    }, 0);
    return (
      <div>
        <header className="White-bg Blue-border Margin-bottom-1 Display-flex-space">
          <div className="Width-33"></div>
          <div>
            <img className="Img-logo-salao Width-33" src={logoVert} alt="Logo" />
          </div>
          <div className="Width-33">
            <Button className="Margin-05" variant="dark" onClick={this.deliver}>ENTREGAS</Button>
            <Button className="Margin-05" variant="dark" onClick={this.signOut}>SAIR</Button>
          </div>
        </header>
        <section className="Display-flex-start">
          <div className='Half-screen'>
            <Tabs className="Display-flex-center" defaultActiveKey="profile" id="uncontrolled-tab-example">
              <Tab className="White-border Tab-box White-bg Padding-top-bottom-1" eventKey="profile" title="CAFÉ DA MANHÃ">
                {produtos.map((produto, i) => {
                  return produto.tipo === 'manhã' ?
                    <Button className="Font-bold White-text Margin-05" variant="info" key={i}
                      onClick={() => this.cliqueDaCompra(produto)}>
                      {produto.nome}<br></br>R$ {produto.preco}</Button> : console.log()
                })}
              </Tab>
              <Tab className="White-border Tab-box White-bg Padding-top-bottom-1" eventKey="home" title="TARDE/NOITE">
                {produtos.map((produto, i) => {
                  return produto.tipo === 'dia' ?
                    <Button className="Font-bold White-text Margin-05" variant="info" key={i}
                      onClick={() => this.cliqueDaCompra(produto)}>
                      {produto.nome}<br></br>R$ {produto.preco}</Button> : console.log()
                })}
              </Tab>
            </Tabs>
          </div>
          <div className='Half-screen White-bg Padding-top-bottom-1 Red-text Font-bold'>
            <InputGroup className="mb-3 Margin-13">
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
            <div className="grid-container">
              <p className="grid-p1 Red-border-bottom Red-border-right Red-border-top">PRODUTO</p>
              <p className="grid-p2 Red-border-bottom Red-border-right Red-border-top">UN</p>
              <p className="grid-p3 Red-border-bottom Red-border-right Red-border-top">QTD</p>
              <p className="grid-p4 Red-border-bottom Red-border-top">TT</p>
              <p className="grid-p5 Red-border-bottom Red-border-top">  </p>
            </div>
            {this.state.comprar.map((produto, i) => {
              return <div key={i} className="grid-container Red-border">
                <p className="grid-p1 Red-border-bottom Red-border-right">{produto.nome}</p>
                <p className="grid-p2 Red-border-bottom Red-border-right">R$ {produto.preco}</p>
                <p className="grid-p3 Red-border-bottom Red-border-right">{produto.quantidade}</p>
                <p className="grid-p4 Red-border-bottom">R$ {produto.preco * produto.quantidade}</p>
                <p className="grid-p5 Red-border-bottom"><button className="Transparent-bg" onClick={() => this.cliqueDeleta(produto)}>
                  <img className="Trash-img" src={trash} alt="trash-icon" /></button></p>
              </div>
            })}
            <div className="Display-flex-center">
              <Button variant="dark" onClick={this.sendOrder}>FECHAR PEDIDO</Button>
              <p className="Margin-13">TOTAL: R$ {valorTotal}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default Salao;