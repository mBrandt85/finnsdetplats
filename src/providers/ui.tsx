import { 
  createContext,
  ReactNode,
  useContext, 
  useState 
} from 'react'
import Backdrop from '../components/backdrop'

const UiContext = createContext({} as {
  toggleBackdrop: (clickable?: boolean) => void
})

export default function UiProvider({ children }: { children: ReactNode }) {
  const [backdrop, setBackdrop] = useState<{
    show: boolean
    bgClose: boolean
  }>({
    show: false,
    bgClose: false
  })

  const toggleBackdrop = (bgClose: boolean = false) => setBackdrop({
    show: !backdrop.show,
    bgClose
  })

  return <UiContext.Provider value={{
    toggleBackdrop
  }}>
    {children}
    <Backdrop show={backdrop.show} bgClose={backdrop.bgClose} onClick={toggleBackdrop} />
  </UiContext.Provider>
}

export const useUi = () => useContext(UiContext)