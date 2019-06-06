import React from 'react';
// import firebase from '../firebaseConfig';
import { Button} from 'react-bootstrap';

function Cozinha() {
    return (
      <div>
          <p>oi Cozinha</p>
          <Button variant="dark" size="lg" onClick={this.signOut}>Sair</Button>
      </div>
    );
  }

  export default Cozinha;