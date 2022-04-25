import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { fadeIn, fadeOut } from '../utils/keyframes'

interface Styled {
  show: boolean
}

interface Props extends Styled {
  bgClose: boolean
  onClick: () => void
}

const Container = styled.div<Styled>`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 80%);
  width: 100%;
  height: 100%;
  animation-name: ${({ show }) => show ? fadeIn : fadeOut};
  animation-duration: .3s;
  animation-iteration-count: 1;
`

export default function Backdrop({ show, bgClose, onClick }: Props) {
  const [active, setActive] = useState<boolean>(false)

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
      setActive(true)
    } else setTimeout(() => {
      document.body.style.overflow = 'auto'
      setActive(false)
    }, 250)
  }, [show])

  return active ? <Container
    show={show} 
    onClick={() => bgClose && onClick()}
  /> : null
}