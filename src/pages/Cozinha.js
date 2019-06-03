import React from 'react';
import firebase from '../firebaseConfig';

const database = firebase.firestore();

function Cozinha() {
    return (
      <div>
          <p>oi Cozinha</p>
      </div>
    );
  }

  export default Cozinha;