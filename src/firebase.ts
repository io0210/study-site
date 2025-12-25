import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase設定
const firebaseConfig = {
  apiKey: 'AIzaSyBCy7na1XdE9IskQP0TVXi6AscNrIXAnEc',
  authDomain: 'study-site-20c6c.firebaseapp.com',
  projectId: 'study-site-20c6c',
  storageBucket: 'study-site-20c6c.firebasestorage.app',
  messagingSenderId: '1009749469098',
  appId: '1:1009749469098:web:f9047a305b695418956dd3',
  measurementId: 'G-BDWW4JB5R8',
}

// Firebase を初期化
const app = initializeApp(firebaseConfig)

// 認証とFirestoreをエクスポート
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

export default app
