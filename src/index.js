import React from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import App from './App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/global.css';

const apiKey = process.env.REACT_APP_FIREBASE_apiKey;
const authDomain = process.env.REACT_APP_FIREBASE_authDomain;
const projectId = process.env.REACT_APP_FIREBASE_projectId;
const storageBucket = process.env.REACT_APP_FIREBASE_storageBucket;
const messagingSenderId = process.env.REACT_APP_FIREBASE_messagingSenderId;
const appId = process.env.REACT_APP_FIREBASE_appId;
const measurementId = process.env.REACT_APP_FIREBASE_measurementId;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
};

export const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp);
export const analytics = getAnalytics();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);