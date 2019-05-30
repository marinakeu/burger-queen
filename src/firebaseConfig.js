import firebase from "firebase";

const config = {
  apiKey: "AIzaSyDY_6gH6ZoCVY4uN78mivIZ5as85vhc8bQ",
  authDomain: "burger-queen-bb2e0.firebaseapp.com",
  databaseURL: "https://burger-queen-bb2e0.firebaseio.com",
  projectId: "burger-queen-bb2e0",
  storageBucket: "burger-queen-bb2e0.appspot.com",
  messagingSenderId: "817989020287",
  appId: "1:817989020287:web:8db3cdebb8318222"
};

firebase.initializeApp(config);

export default firebase;