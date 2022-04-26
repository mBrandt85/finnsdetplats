import { StrictMode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleAuthProvider, onAuthStateChanged, signInWithRedirect } from 'firebase/auth'

import './index.css'
import Providers from './providers'
import { auth } from './firebase'
import { useAppState } from './providers/app-state'
import Loading from './components/loading'
import View from './components/view'
import NotOk from './components/not-ok'
import { getWeek } from './utils/week'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

function App() {
  const { user, setUser, setWeek } = useAppState()
  const [loading, setLoading] = useState<boolean>(true)

  const login = async () => {
    const provider = new GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    await signInWithRedirect(auth, provider)
  }

  useEffect(() => {
    onAuthStateChanged(auth,
      user => {
        if (user) {
          setUser(user)
          setWeek(getWeek())
          setLoading(false)
        } else login()
      },
      error => console.log(error),
      () => console.log('auth state observer removed')
    )
  // eslint-disable-next-line
  }, [])

  if (loading) return <Loading text="kollar att du är ok..." />

  return user!.email!.includes('@cygni.se')
    ? <View /> 
    : <NotOk />
}

root.render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
)