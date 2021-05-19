import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

if (!firebase.apps.length) {
  // Paste your config object here ⬇️
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
  };

  firebase.initializeApp(firebaseConfig);
} else {
  // if already initialized, use that one
  firebase.app();
}

const firestore = firebase.firestore();
export const database = {
  gifs: firestore.collection("gifs"),
  formatDoc: (doc) => {
    return { id: doc.id, ...doc.data() };
  },
  getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp,
};

export const storage = firebase.storage();
export const auth = firebase.auth();
