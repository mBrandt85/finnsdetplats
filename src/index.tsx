import { StrictMode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth'

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

  const specialForces = [
    'magnusbrandt85@gmail.com',
    'sebastianberglonn@gmail.com',
    'en.ahmadmarei@gmail.com',
    'mattias.pedersen89@gmail.com'
  ]

  const login = () => {
    const provider = new GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    signInWithPopup(auth, provider).then(result => {
      //const credential = GoogleAuthProvider.credentialFromResult(result)
      //const token = credential ? credential.accessToken : null
      //const user = result.user
      setUser(result.user)
      setWeek(getWeek())
      setLoading(false)
    }).catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.customData.email
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log(errorCode, errorMessage, email, credential)
    })
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

  if (loading) return <Loading text="kollar att du är ok... om inget händer kolla så du inte blockat nått popup!" />

  return (
    user!.email!.includes('@cygni.se')
    || specialForces.includes(user!.email!)
  )
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