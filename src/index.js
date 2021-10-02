import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'firebase/firestore'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDRYWmqVLOdPwNWNndpEViT0OluHhI_Q6g",
  authDomain: "ecommerce-c5a19.firebaseapp.com",
  projectId: "ecommerce-c5a19",
  storageBucket: "ecommerce-c5a19.appspot.com",
  messagingSenderId: "569089459356",
  appId: "1:569089459356:web:cb2848f1957dbd87d59959"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

ReactDOM.render( <App />, document.getElementById('root'));
