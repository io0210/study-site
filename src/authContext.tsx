import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider } from './firebase'

type AuthContextType = {
  currentUser: User | null
  loading: boolean
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error: any) {
      console.error('Googleログインエラー:', error)
      // エラーメッセージをより分かりやすく
      if (error.code === 'auth/popup-blocked') {
        throw new Error('ポップアップがブロックされました。ブラウザの設定でポップアップを許可してください。')
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('ログインウィンドウが閉じられました。')
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('このドメインは認証に使用できません。Firebase Consoleでドメインを追加してください。')
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Google認証が有効化されていません。Firebase Consoleで設定を確認してください。')
      }
      throw error
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      console.error('メールログインエラー:', error)
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('メール/パスワード認証が有効化されていません。Firebase Consoleで設定を確認してください。')
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('このドメインは認証に使用できません。Firebase Consoleでドメインを追加してください。')
      }
      throw error
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      console.error('サインアップエラー:', error)
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('メール/パスワード認証が有効化されていません。Firebase Consoleで設定を確認してください。')
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('このドメインは認証に使用できません。Firebase Consoleでドメインを追加してください。')
      }
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('ログアウトエラー:', error)
      throw error
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    loading,
    loginWithGoogle,
    loginWithEmail,
    signUpWithEmail,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}










