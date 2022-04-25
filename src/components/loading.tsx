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
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(6, 155, 229);
  text-transform: uppercase;
  letter-spacing: .05rem;
  animation-name: ${fadeInOut};
  animation-duration: 1s;
  animation-iteration-count: infinite;
`

export default function Loading({ text = 'LOADING' }: { text?: string}) {
  return (
    <Container>
      <Text>
        {text}
      </Text>
    </Container>
  )
}