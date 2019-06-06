import React from 'react';
import firebase from '../firebaseConfig';
import logo from '../assets/img/logo.png';
import { Button, Tab, Tabs } from 'react-bootstrap';

const produtos = [
  {
    nome: "Café americano",
    preco: 5,
    tipo: "manhã"
  },
  {
    nome: "Café com leite",
    preco: 7,
    tipo: "manhã"
  },
  {
    nome: "Sanduíche de presunto e queijo",
    preco: 10,
    tipo: "manhã"
  },
  {
    nome: "Suco de fruta natural",
    preco: 7,
    tipo: "manhã"
  },
  {
    nome: "Hambúrguer simples",
    preco: 10,
    tipo: "dia"
  },
  {
    nome: "Hambúrguer duplo",
    preco: 15,
    tipo: "dia"
  },
  {
    nome: "Batata frita",
    preco: 5,
    tipo: "dia"
  },
  {
    nome: "Anéis de cebola",
    preco: 5,
    tipo: "dia"
  },
  {
    nome: "Água 500ml",
    preco: 5,
    tipo: "dia"
  },
  {
    nome: "Água 750ml",
    preco: 7,
    tipo: "dia"
  },
  {
    nome: "Bebida gaseificada 500ml	",
    preco: 7,
    tipo: "dia"
  },
  {
    nome: "Bebida gaseificada 750ml",
    preco: 10,
    tipo: "dia"
  }
]

class Salao extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comprar: []
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

  render() {
    console.log(this.state.comprar);
    const valorTotal = this.state.comprar.reduce((acc, cur) => {
      return acc + (cur.quantidade * cur.preco)
    }, 0);
    return (
      <div>
        <header className="header-salao">
          <img className="Logo-img-salao" src={logo} alt="Logo" />
        </header>
        <section className="Full-size Display-flex">
          <div className='half-screen'>

            <Tabs className="Display-flex" defaultActiveKey="profile" id="uncontrolled-tab-example">
              <Tab className="White-border Tab-box" eventKey="profile" title="CAFÉ DA MANHÃ">
                {
                  
                  produtos.map((produto, i) => {
                    return produto.tipo === 'manhã' ?
                      <button key={i}
                        onClick={() => this.cliqueDaCompra(produto)}>
                        {produto.nome}</button> : console.log()
                  })
              }
              </Tab>
              <Tab className="White-border Tab-box" eventKey="home" title="TARDE/NOITE">
              {
                  produtos.map((produto, i) => {
                    return produto.tipo === 'dia' ?
                      <button key={i}
                        onClick={() => this.cliqueDaCompra(produto)}>
                        {produto.nome}</button> : console.log()
                  })
              }
              </Tab>
            </Tabs>

            <Button variant="dark" size="lg" onClick={this.signOut}>Sair</Button>
          </div>
          <div className='half-screen'>
            <h1>Itens comprados</h1>
            {
              this.state.comprar.map((produto, i) => {
                return <div key={i}>
                  <p key={i}>{produto.nome} -
            {produto.preco * produto.quantidade} - {produto.quantidade}</p>
                  <button onClick={() => this.cliqueDeleta(produto)}></button>
                </div>
              })
            }
            < hr ></hr >
            <h1>Total</h1>
            <p>Valor total: {valorTotal}</p>
          </div>

        </section>
      </div >
    );
  }
}

export default Salao;