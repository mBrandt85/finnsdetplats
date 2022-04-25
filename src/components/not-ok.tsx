import { faHand } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const Icon = styled.span`
  font-size: 10rem;
  color: rgb(6, 155, 229);
`

const Text = styled.div`
  padding: 1rem;
  margin-top: 2rem;
  font-size: 2em;
  color: rgb(6, 155, 229);
  text-align: center;
`

export default function NotOk({ text = 'LOADING' }: { text?: string}) {
  return (
    <Container>
      <Icon>
        <FontAwesomeIcon icon={faHand} />
      </Icon>

      <Text>
        Cygnianer only!
        <br />
        Använd din Cygni Mail
      </Text>
    </Container>
  )
}