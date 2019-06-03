import React from 'react';
import firebase from '../firebaseConfig';

const database = firebase.firestore();

function Salao() {
    return (
      <div>
          <p>oi salao</p>
      </div>
    );
  }

  export default Salao;