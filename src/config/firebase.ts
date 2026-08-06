import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDt7KKRQUHRS8vAGZQuBYH1Ir5EhDkmwvc',
  authDomain: 'feazto-e14b3.firebaseapp.com',
  projectId: 'feazto-e14b3',
  storageBucket: 'feazto-e14b3.firebasestorage.app',
  messagingSenderId: '337038716736',
  appId: '1:337038716736:android:0731806a5f463c72ee94a5',
}

// Prevent duplicate initialization on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
// Firestore region: asia-southeast1 (Singapore)
export const db = getFirestore(app)
