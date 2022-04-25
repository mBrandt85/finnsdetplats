import { ReactNode } from 'react'

import AppStateProvider from './app-state'
import UiProvider from './ui'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppStateProvider>
      <UiProvider>
        {children}
      </UiProvider>
    </AppStateProvider>
  )
}