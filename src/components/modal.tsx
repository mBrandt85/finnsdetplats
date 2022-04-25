import { useState } from 'react'
import styled from 'styled-components'

import { fadeIn } from '../utils/keyframes'

interface Props {
  show: boolean
  element: JSX.Element
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 80%);
  width: 100%;
  height: 100%;
  animation-name: ${fadeIn};
  animation-duration: .3s;
`

export default function Modal({ show, element: Element }: Props) {
  return show ? <Container></Container> : null
}