// src/lib/firebase/init.ts
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDAKu4z1mYcd3uHMYkVaOuPdoKatXtV9EE",
  authDomain: "hanzotech.firebaseapp.com",
  databaseURL: "https://hanzotech-default-rtdb.firebaseio.com",
  projectId: "hanzotech",
  storageBucket: "hanzotech.appspot.com",
  messagingSenderId: "109986788087",
  appId: "1:109986788087:web:aa263c2a206fb6faaed9f2"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
