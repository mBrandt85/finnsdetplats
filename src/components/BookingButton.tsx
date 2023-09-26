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
    &.dark {
        background-color: #3e3277;
        &.check {
            background-color: orange;
            box-shadow: rgba(50, 50, 93, 0.35) 0px 10px 10px -12px inset,
                rgba(0, 0, 0, 0.4) 0px 18px 26px -18px inset;
        }
        &.full {
            background-color: #515151;
            color: #a8a8a8;
            box-shadow: none;
        }
    }

    display: flex;
    padding: 0.4rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 4rem;
    border-radius: 0.5rem;
    background-color: #049be5;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    color: white;
    transition: background-color 200ms, transform 200ms;
    cursor: ${({ button }) => (button === 'full' ? 'not-allowed' : 'pointer')};

    @media screen and (max-width: 500px) {
        width: 3rem;
        font-size: 0.8rem;
    }

    &.check {
        background-color: #1fc299;
        transform: scale(0.95);
        box-shadow: rgba(50, 50, 93, 0.25) 0px 10px 10px -12px inset,
            rgba(0, 0, 0, 0.3) 0px 18px 26px -18px inset;
    }
    &.full {
        background-color: #d9d9d9;
        color: #9f9f9f;
        box-shadow: none;
    }
`;

const ContainerP = styled(Container)`
    &.dark {
        background-color: #492d5c;
    }
    background-color: hsl(199, 30%, 45%);
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
    location: string;
}

export default function BookingButton({
    type,
    date,
    bookings,
    partOfDay,
}: Props) {
    const { user, lightmode, numOfParkingSpots, numOfSeats, currentLocation } =
        useAppState();
    const { uid, displayName, photoURL } = user!;
    const [loading, setLoading] = useState<boolean>(false);
    const [button, setButton] = useState<'passed' | 'free' | 'full' | 'check'>(
        'free'
    );
    const location = currentLocation;
    const booked = bookings.filter(
        (booking) => booking.date === date && booking.type === type
    );
    const personal = booked.filter((booking) => booking.uid === uid);
    const quantity =
        type === 'd'
            ? !(date <= '2022-06-12' || date >= '2022-07-06')
                ? 5
                : numOfSeats
            : numOfParkingSpots;

    const handleAdd = async () => {
        setLoading(true);

        const doc: Doc = {
            date,
            type,
            uid,
            displayName,
            photoURL,
            location,
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
            <ContainerP
                className={`${button} ${lightmode}`}
                button={button}
                onClick={onClick}
            >
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
        <Container
            className={`${button} ${lightmode}`}
            button={button}
            onClick={onClick}
        >
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
