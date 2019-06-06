import React from 'react';
import firebase from '../firebaseConfig';

const produtos = [
  {
    nome: "Camiseta",
    preco: 30.50
  },
  {
    nome: "Sapato",
    preco: 100.99
  },
  {
    nome: "Calça",
    preco: 80.78
  }
]

class Salao extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comprar: []
    };
  }

  // componentDidMount() {
  //   firebase.auth().onAuthStateChanged(function (user) {
  //     if (user) {
  //       console.log('tem user');
  //     } else {
  //       console.log("User is signed out.")
  //       this.props.history.push('/');
  //     }
  //   });
  // }

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
        <p>oi salao</p>
        {
          produtos.map((produto, i) => {
            return <button key={i}
              onClick={() => this.cliqueDaCompra(produto)}>
              {produto.nome}</button>
          })
        }
        < hr ></hr >
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

      </div >
    );
  }
}

export default Salao;