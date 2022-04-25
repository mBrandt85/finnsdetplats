import { faHand } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

import { fadeInOut } from '../utils/keyframes'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const Text = styled.span`
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(6, 155, 229);
  text-transform: uppercase;
  letter-spacing: .05rem;
  animation-name: ${fadeInOut};
  animation-duration: 1s;
  animation-iteration-count: infinite;
`

export default function NotOk({ text = 'LOADING' }: { text?: string}) {
  return (
    <Container>
      <FontAwesomeIcon icon={faHand} />

      <Text>
        {text}
      </Text>
    </Container>
  )
}