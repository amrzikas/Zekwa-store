import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

import firebaseConfig from '../../firebase-applet-config.json';

const isConfigValid = firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey.length > 0;

export const app = isConfigValid ? initializeApp(firebaseConfig) : null;

// @ts-ignore
export const db = app ? getFirestore(app, firebaseConfig.firestoreDatabaseId) : null;
export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

if (!isConfigValid) {
  console.warn('Firebase API key is missing. Firebase features will be disabled. Please run the set_up_firebase tool.');
}

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

if (Object.keys(firebaseConfig).length > 0) {
  testConnection();
}
