import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCS_tQ7ooF4J4sgaiXkrayOACpnxEtJDCc',
  authDomain: 'nextjs-firebase-dev.firebaseapp.com',
  projectId: 'nextjs-firebase-dev',
  storageBucket: 'nextjs-firebase-dev.appspot.com',
  messagingSenderId: '762952016003',
  appId: '1:762952016003:web:9f3e09f6b02367493d7bb6',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Auth exports
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

// Firestore exports
export const firestore = firebase.firestore();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const increment = firebase.firestore.FieldValue.increment;

// Storage exports
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
