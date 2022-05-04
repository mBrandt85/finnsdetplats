import { faDisplay, faInfoCircle, faParking } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import styled from 'styled-components'

import { Booking } from '../providers/app-state'
import { fadeIn } from '../utils/keyframes'
import { hasPassed, isToday, isWeekend, parseDate, parseDay, parseMonth } from '../utils/week'
import Button from './button'
import Modal from './modal'

interface Styled {
  date: string
}

interface Props extends Styled {
  bookings: Booking[]
}

const Container = styled.div<Styled>`
  display: flex;
  border-radius: .5rem;
  padding: ${({ date }) => isToday(date) ? '.5rem 1rem' : '.5rem'};
  background-color: ${({ date }) => hasPassed(date) ? 'rgba(255, 255, 255, 40%)' 
    : isToday(date) ? 'white' 
    : 'rgb(250, 250, 250)'};
  box-shadow: 0 .25rem .25rem rgba(0, 0, 0, 15%);
  margin-left: ${({ date }) => isToday(date) ? '-1rem' : '0'};
  margin-right: ${({ date }) => isToday(date) ? '-1rem' : '0'};
  animation-name: ${fadeIn};
  -webkit-animation-name: ${fadeIn};
  animation-duration: .3s;
  -webkit-animation-duration: .3s;
  animation-timing-function: ease-in;
  -webkit-animation-timing-function: ease-in;

  @media screen and (max-width: 500px) {
    border-radius: ${({ date }) => isToday(date) ? '0' : '.5rem'};
  }

  @media screen and (min-width: 501px) {
    margin-top: 1rem;
  }

  & .date {
    display: flex;
    align-items: center;
    font-size: ${({ date }) => isToday(date) ? '4rem' : '3rem'};
    line-height: ${({ date }) => isToday(date) ? '4rem' : '3rem'};
    letter-spacing: -.25rem;
    font-weight: ${({ date }) => isToday(date) ? '400' : '300'};
    font-family: 'Roboto Condensed', sans-serif;
    color: ${({ date }) => hasPassed(date) ? 'rgb(150, 150, 150)' 
      : isWeekend(date) ? 'rgb(200, 80, 80)' 
      : '#222'};
  }

  & .daymonth {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    padding: 0 .5rem;

    .dayname {
      font-size: ${({ date }) => isToday(date) ? '1.75rem' : '1.5rem'};
      line-height: ${({ date }) => isToday(date) ? '1.75rem' : '1.5rem'};
      letter-spacing: -.05rem;
      font-family: 'Roboto Condensed', sans-serif;
      font-weight: 400;
      color: ${({ date }) => hasPassed(date) ? 'rgb(180, 180, 180)' 
        : isWeekend(date) ? 'rgb(200, 120, 120)' 
        : '#555'};
      text-transform: capitalize;
    }

    .month {
      font-size: ${({ date }) => isToday(date) ? '1.25rem' : '.9rem'};
      line-height: ${({ date }) => isToday(date) ? '1.25rem' : '.9rem'};
      font-weight: 400;
      color: ${({ date }) => hasPassed(date) ? 'rgb(190, 190, 190)' 
        : isWeekend(date) ? 'rgb(200, 150, 150)' 
        : '#888'};
      text-transform: uppercase;
      font-family: 'Roboto Condensed', sans-serif;
    }
  }

  & .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 .5rem;
    margin-right: .5rem;
    font-size: 1.25rem;
    color: rgb(6, 155, 229);
    cursor: pointer;
  }

  & .actions {
    display: flex;

    >:first-child {
      margin-right: .5rem;
    }
  }
`

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  margin-top: .5rem;

  & > img {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
  }

  & > span {
    margin-left: .5rem;
    font-weight: 700;
  }
`

export default function Card({ date, bookings }: Props) {
  const [modal, setModal] = useState<boolean>(false)
  const dBookings = bookings.filter(({ type }) => type === 'd')
  const pBookings = bookings.filter(({ type }) => type === 'p')

  return <>
    <Container date={date}>
      <div className='date'>
        {parseDate(date)}
      </div>

      <div className='daymonth'>
        <div className='dayname'>
          {parseDay(date)}
        </div>

        <div className='month'>
          {parseMonth(date)}
        </div>
      </div>

      {(dBookings.length > 0 || pBookings.length > 0) && <div className='info' onClick={() => setModal(!modal)}>
        <FontAwesomeIcon 
          icon={faInfoCircle}
          style={{ fontSize: isToday(date) ? '2rem' : '1.5rem' }}
        />
      </div>}

      <div className='actions'>
        <Button type="d" date={date} bookings={dBookings} />
        <Button type="p" date={date} bookings={pBookings} />
      </div>
    </Container>

    {modal && <Modal close={() => setModal(!modal)}>
      <header>
        {parseDay(date) + ' ' + parseDate(date) + ' ' + parseMonth(date)}
      </header>

      <main>
        {dBookings.length > 0 && <div>
          <FontAwesomeIcon style={{ fontSize: '1.5rem' }} icon={faDisplay} />
          {dBookings.map(({ displayName, photoURL }, key) =>
            <UserDetails key={key}>
              <img src={photoURL} alt={displayName} />
              <span>{displayName}</span>
            </UserDetails>)}
        </div>}

        {pBookings.length > 0 && <div style={{ marginTop: '2rem' }}>
          <FontAwesomeIcon style={{ fontSize: '1.5rem' }} icon={faParking} />
          {pBookings.map(({ displayName, photoURL }, key) =>
            <UserDetails key={key}>
              <img src={photoURL} alt={displayName} />
              <span>{displayName}</span>
            </UserDetails>)}
        </div>}
      </main>
    </Modal>}
  </>
}