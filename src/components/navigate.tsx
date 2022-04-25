import { faAngleLeft, faAngleRight, faCalendarDay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useAppState } from '../providers/app-state'
import { fadeIn } from '../utils/keyframes'
import { getWeek, lastWeek, nextWeek, parseFullDate } from '../utils/week'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  animation-name: ${fadeIn};
  -webkit-animation-name: ${fadeIn};
  animation-duration: .3s;
  -webkit-animation-duration: .3s;
  animation-timing-function: ease-in;
  -webkit-animation-timing-function: ease-in;
`

const Button = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: rgb(6, 155, 229);
  font-size: 1.25rem;
  color: white;
  box-shadow: 0 .25rem .25rem rgba(0, 0, 0, 15%);
  cursor: pointer;
`

export default function Navigate() {
  const { week, setWeek } = useAppState()
  const [show, setShow] = useState<boolean>(false)

  const handleLast = () => setWeek(lastWeek(week[0].date))
  const handleNext = () => setWeek(nextWeek(week[6].date))
  const handleCurrent = () => setWeek(getWeek())

  useEffect(() => {
    const currentDate = parseFullDate(new Date())
    if (week.filter(({ date }) => date === currentDate).length > 0)
      setShow(false)
    else setShow(true)
  }, [week])

  return (
    <Container>
      <Button onClick={handleLast}>
        <FontAwesomeIcon icon={faAngleLeft} />
      </Button>

      {show && <Button onClick={handleCurrent}>
        <FontAwesomeIcon icon={faCalendarDay} />
      </Button>}

      <Button onClick={handleNext}>
        <FontAwesomeIcon icon={faAngleRight} />
      </Button>
    </Container>
  )
}