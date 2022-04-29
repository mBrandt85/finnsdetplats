import { signOut } from 'firebase/auth'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { auth, firestore } from '../firebase'
import { Booking, useAppState } from '../providers/app-state'
import { fadeIn } from '../utils/keyframes'
import Card from './card'
import Loading from './loading'
import Navigate from './navigate'

const Container = styled.div`
  margin: 0 auto;
  padding: 1rem;
  width: 100%;
  max-width: 36rem;

  & > header {
    display: flex;
    justify-content: space-between;
    font-family: 'Roboto Condensed', sans-serif;
    font-weight: 400;
    font-size: 1.6rem;
    letter-spacing: -.025rem;
    animation-name: ${fadeIn};
    -webkit-animation-name: ${fadeIn};
    animation-duration: .3s;
    -webkit-animation-duration: .3s;
    animation-timing-function: ease-in;
    -webkit-animation-timing-function: ease-in;

    > span {
      color: white;
      text-shadow: .1rem .1rem 0 rgba(0, 0, 0, 25%);
    }
  }

  & > :first-child {
    margin-top: 0;
  }

  & > :last-child {
    margin-top: 1rem;
  }
`

const UserBadge = styled.div`
  display: flex;
  align-items: center;
  height: 2rem;
  font-size: 1.25rem;
  background-color: white;
  border-radius: .875rem;
  box-shadow: 0 .25rem .25rem rgba(0, 0, 0, 15%);

  & > img {
    border-radius: 50%;
    width: 1.75rem;
    height: 1.75rem;
    margin-left: .2rem;
    box-shadow: 0 0 .5rem rgba(0, 0, 0, 25%);
  }

  & > .display-name {
    color: #444;
    font-size: 1.1rem;
    padding: 0 1rem 0 .5rem;
  }
`

export default function View() {
  const { user, week, bookings, addBooking, removeBooking } = useAppState()
  const [loading, setLoading] = useState<boolean>(true)
  const [clicks, setClicks] = useState<number>(0)

  const logout = async () => await signOut(auth)

  useEffect(() => {
    if (clicks === 10) logout()
  // eslint-disable-next-line
  }, [clicks])

  useEffect(() => {
    setLoading(true)
    const unsubscribe = onSnapshot(
      query(
        collection(firestore, 'bookings'), 
        where('date', '>=', week[0].date),
        where('date', '<=', week[6].date)
      ),
      snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            addBooking({
              id: change.doc.id,
              ...change.doc.data() as Booking
            })
          }

          if (change.type === 'removed')
            removeBooking(change.doc.id)
        })
        setLoading(false)
      }
    )

    return () => unsubscribe()
  // eslint-disable-next-line
  }, [week])

  if (loading) return <Loading text='hämtar bokningar...' />
  
  return (
    <Container>
      <header>
        <span>Finns det plats?</span>
        <UserBadge onClick={() => setClicks(clicks + 1)}>
          <img src={user!.photoURL!} alt={user!.displayName!} />
          <div className="display-name">{user!.displayName!.split(' ')[0]}</div>
          <span></span>
        </UserBadge>
      </header>

      {week.map(({ date }, idx) => 
        <Card 
          key={idx}
          date={date} 
          bookings={bookings.filter(booking => booking.date === date)}
        />
      )}

      <Navigate />
    </Container>
  )
}