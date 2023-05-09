import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import styled from 'styled-components';

import { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { Booking, useAppState } from '../providers/app-state';
import { hasPassed } from '../utils/week';

interface Styled {
  button: string;
}

interface Props {
  type: 'd' | 'p';
  date: string;
  bookings: Booking[];
  partOfDay?: number;
}

const Container = styled.div<Styled>`
  display: flex;
  padding: 0.4rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 100%;
  border-radius: 0.5rem;
  background-color: #049be5;
  font-size: 0.8rem;

  color: white;
  cursor: ${({ button }) => (button === 'full' ? 'not-allowed' : 'pointer')};

  &.check {
    background-color: #025f8d;
  }
  &.full {
    background-color: #d9d9d9;
    color: #9f9f9f;
    box-shadow: none;
  }
  &.passed {
    opacity: 0.5;
  }
`;

const ContainerP = styled(Container)`
  color: white;
`;

const Text = styled.span<{ date: string; trigger?: boolean }>`
  margin-top: 0.25rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.05rem;
`;

const ButtonLabel = styled.span`
  font-weight: 500;
`;

interface Doc {
  date: string;
  type: 'p' | 'd';
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  partOfDay?: number;
}

export default function Button({ type, date, bookings, partOfDay }: Props) {
  const { user } = useAppState();
  const { uid, displayName, photoURL } = user!;
  const [loading, setLoading] = useState<boolean>(false);
  const [button, setButton] = useState<'passed' | 'free' | 'full' | 'check'>(
    'free'
  );
  const booked = bookings.filter(
    (booking) => booking.date === date && booking.type === type
  );
  const personal = booked.filter((booking) => booking.uid === uid);
  const quantity =
    type === 'd'
      ? !(date <= '2022-06-12' || date >= '2022-07-06')
        ? 5
        : 8
      : 3;

  const handleAdd = async () => {
    setLoading(true);
    const doc: Doc = {
      date,
      type,
      uid,
      displayName,
      photoURL,
    };
    if (partOfDay) doc.partOfDay = partOfDay;
    await addDoc(collection(firestore, 'bookings'), doc);
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    await deleteDoc(doc(firestore, 'bookings', personal[0].id!));
    setLoading(false);
  };

  useEffect(() => {
    if (hasPassed(date)) setButton('passed');
    else {
      if (personal.length > 0) setButton('check');
      else {
        if (booked.length >= quantity) setButton('full');
        else setButton('free');
      }
    }
    // eslint-disable-next-line
  }, [bookings]);

  const onClick = () => {
    if (loading) return;
    if (button === 'check' && !hasPassed(date)) handleDelete();
    if (button !== 'check' && button === 'free' && !hasPassed(date))
      handleAdd();
  };

  if (type === 'p')
    return (
      <ContainerP className={button} button={button} onClick={onClick}>
        <ButtonLabel>{partOfDay === 1 ? 'FM' : 'EM'}</ButtonLabel>

        <Text date={date}>
          {loading ? (
            '...'
          ) : (
            <span>
              {bookings.length}&nbsp;/&nbsp;{quantity}
            </span>
          )}
        </Text>
      </ContainerP>
    );

  return (
    <Container className={button} button={button} onClick={onClick}>
      <ButtonLabel>{partOfDay === 1 ? 'FM' : 'EM'}</ButtonLabel>
      <Text date={date}>
        {loading ? (
          '...'
        ) : (
          <span>
            {bookings.length}&nbsp;/&nbsp;{quantity}
          </span>
        )}
      </Text>
    </Container>
  );
}
