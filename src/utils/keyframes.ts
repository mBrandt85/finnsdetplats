import { keyframes } from 'styled-components'

export const fadeInOut = keyframes`
  0% { transform: scale(.8); opacity: 0; }
  25% { transform: scale(1); opacity: 1; }
  100% { transform: scale(.8); opacity: 0; }
`

export const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`

export const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`