import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDisplay, faParking } from '@fortawesome/free-solid-svg-icons'

import { fadeIn } from '../utils/keyframes'
import { Booking, useAppState } from '../providers/app-state'
import { firestore } from '../firebase'
import { useEffect, useState } from 'react'

interface Styled {
  button: string
}

interface Props {
  type: 'd' | 'p'
  date: string
  bookings: Booking[]
}

const Container = styled.div<Styled>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 4rem;
  height: 100%;
  border-radius: .5rem;
  background-color: ${({ button }) => 
    button === 'check' ? 'rgb(240, 240, 240)' 
    : button === 'free' ? 'rgb(200, 250, 200)' 
    : 'none'};
  color: ${({ button }) => 
    button === 'check' ? 'rgb(6, 155, 229)' 
    : button === 'free' ? 'rgb(40, 100, 40)' 
    : 'rgb(130, 0, 0)'};
  box-shadow: ${({ button }) => 
    button === 'check' ? '0 .1rem .1rem rgba(0, 0, 0, 20%) inset' 
    : button === 'free' ? '0 .1rem .1rem rgba(0, 0, 0, 20%)' 
    : 'none'};
  cursor: ${({ button }) => 
    button === 'full' ? 'not-allowed' 
    : 'pointer'};
`

const Text = styled.span`
  margin-top: .25rem;
  font-size: .8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -.05rem;
  animation-name: ${fadeIn};
  -webkit-animation-name: ${fadeIn};
  animation-duration: .3s;
  -webkit-animation-duration: .3s;
  animation-timing-function: ease-in;
  -webkit-animation-timing-function: ease-in;
`

export default function Button({ type, date, bookings }: Props) {
  const { user } = useAppState()
  const { uid, displayName, photoURL } = user!
  const [loading, setLoading] = useState<boolean>(false)
  const [button, setButton] = useState<'free' | 'full' | 'check'>('free')
  const booked = bookings.filter(booking => booking.date === date && booking.type === type)
  const personal = booked.filter(booking => booking.uid === uid)
  const quantity = type === 'd' ? 8 : 3

  const handleAdd = async () => {
    setLoading(true)
    await addDoc(collection(firestore, 'bookings'), {
      date,
      type,
      uid,
      displayName,
      photoURL
    })
    setLoading(false)
  }

  const handleDelete = async () => {
    setLoading(true)
    await deleteDoc(doc(firestore, 'bookings', personal[0].id!))
    setLoading(false)
  }

  useEffect(() => {
    if (personal.length > 0) setButton('check')
    else {
      if (booked.length >= quantity) setButton('full')
      else setButton('free')
    }
  // eslint-disable-next-line
  }, [bookings])

  return (
    <Container button={button} onClick={() => {
      if (!loading) {
        if (button === 'check') handleDelete()
        if (button !== 'check' && button === 'free') handleAdd()
      }
    }}>
      <FontAwesomeIcon icon={type === 'd' ? faDisplay : faParking} />

      {loading
        ?<Text>
          ...
        </Text>
        : <Text>
          {bookings.length} / {quantity}
        </Text>
      }
    </Container>
  )
}