import { initializeApp, getApps } from 'firebase/app'
import { initializeAuth, getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
}

// Prevent duplicate initialization on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

function getAuthInstance() {
  if (getApps().length > 1) {
    return getAuth(app)
  }
  try {
    const { getReactNativePersistence } = require('firebase/auth')
    const ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default
    return initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    })
  } catch (e) {
    return getAuth(app)
  }
}

export const auth = getAuthInstance()

// Firestore region: asia-southeast1 (Singapore)
export const db = getFirestore(app)
