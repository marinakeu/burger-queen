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

  componentDidMount() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log('tem user');
      } else {
        console.log("User is signed out.");
      }
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

  handleChange = (event, element) => {
    const newState = this.state;
    newState[element] = event.target.value
    this.setState(newState);
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
            orderNumber: this.state.orderNumber,
            clientName: this.state.client,
            atendentName: this.state.atendentName,
            order: this.state.comprar,
            moment: new Date(),
            ready: false
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

  render() {
    const valorTotal = this.state.comprar.reduce((acc, cur) => {
      return acc + (cur.quantidade * cur.preco)
    }, 0);
    return (
      <div>

        <header className="header-salao Display-flex-space">
          <div>
          </div>
          <img className="Logo-img-salao" src={logoVert} alt="Logo" />
          <Button className="btn-logout" variant="dark" onClick={this.signOut}>SAIR</Button>

        </header>

        <section className="Display-flex-start">
          <div className='half-screen'>

            <Tabs className="Display-flex-center" defaultActiveKey="profile" id="uncontrolled-tab-example">
              <Tab className="White-border Tab-box white-bg" eventKey="profile" title="CAFÉ DA MANHÃ">
                {

                  produtos.map((produto, i) => {
                    return produto.tipo === 'manhã' ?
                      <Button className="menu-btn" variant="info" key={i}
                        onClick={() => this.cliqueDaCompra(produto)}>
                        {produto.nome}<br></br>R$ {produto.preco}</Button> : console.log()
                  })
                }
              </Tab>
              <Tab className="White-border Tab-box white-bg" eventKey="home" title="TARDE/NOITE">
                {
                  produtos.map((produto, i) => {
                    return produto.tipo === 'dia' ?
                      <Button className="menu-btn" variant="info" key={i}
                        onClick={() => this.cliqueDaCompra(produto)}>
                        {produto.nome}<br></br>R$ {produto.preco}</Button> : console.log()
                  })
                }
              </Tab>
            </Tabs>
          </div>
          <div className='half-screen white-bg red-text'>
            <InputGroup className="mb-3 margin-1">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1" className="info-bg" >CLIENTE</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder=""
                aria-label="client-name"
                aria-describedby="basic-addon1"
                value={this.state.client}
                onChange={(e) => this.handleChange(e, "client")}
              />
            </InputGroup>
            <div className="grid-container">
              <p className="grid-p1 red-border-bottom red-border-right red-border-top">PRODUTO</p>
              <p className="grid-p2 red-border-bottom red-border-right red-border-top">UN</p>
              <p className="grid-p3 red-border-bottom red-border-right red-border-top">QTD</p>
              <p className="grid-p4 red-border-bottom red-border-top">TT</p>
              <p className="grid-p5 red-border-bottom red-border-top">  </p>
            </div>
            {this.state.comprar.map((produto, i) => {
              return <div key={i} className="grid-container red-border">
                <p className="grid-p1 red-border-bottom red-border-right">{produto.nome}</p>
                <p className="grid-p2 red-border-bottom red-border-right">R$ {produto.preco}</p>
                <p className="grid-p3 red-border-bottom red-border-right">{produto.quantidade}</p>
                <p className="grid-p4 red-border-bottom">R$ {produto.preco * produto.quantidade}</p>
                <p className="grid-p5 red-border-bottom"><button className="transparent-bg" onClick={() => this.cliqueDeleta(produto)}>
                  <img className="Trash-img" src={trash} alt="trash-icon" /></button></p>
              </div>
            })}
            <div className="Display-flex-center">
              <Button variant="dark" onClick={this.sendOrder}>FECHAR PEDIDO</Button>
              <p className="margin-1">TOTAL: R$ {valorTotal}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default Salao;