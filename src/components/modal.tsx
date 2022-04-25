import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactNode } from 'react'
import styled from 'styled-components'

import { fadeIn } from '../utils/keyframes'

interface Props {
  children: ReactNode
  close: () => void
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 80%);
  width: 100%;
  height: 100%;
  z-index: 10;
  padding: 2rem;
  animation-name: ${fadeIn};
  animation-duration: .3s;
`

const Content = styled.div`
position: relative;
  width: 100%;
  height: 100%;
  max-width: 24rem;
  max-height: 36rem;
  z-index: 20;
  padding: 1rem;
  border-radius: 1rem;
  background-color: white;
  animation-name: ${fadeIn};
  animation-duration: .3s;

  & > header {
    font-family: 'Roboto Condensed', sans-serif;
    font-weight: 400;
    font-size: 1.6rem;
    letter-spacing: -.025rem;
    text-transform: capitalize;
  }

  & > main {
    margin-top: 1rem;
  }

  & > footer {
    margin-top: 1rem;
  }
`

const Close = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: .75rem 1.25rem;
  font-size: 1.5rem;
  cursor: pointer;
`

export default function Modal({ children, close }: Props) {
  return (
    <Backdrop>
      <Content>
        <Close onClick={close}>
          <FontAwesomeIcon icon={faXmark} />
        </Close>

        {children}
      </Content>
    </Backdrop>
  )
}