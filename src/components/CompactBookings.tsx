import { useEffect, useState } from 'react';
import { Booking, useAppState } from '../providers/app-state';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start !important;
    margin-bottom: 2rem;
    & > h2 {
        font-size: 1.1rem;
    }
`;

const BookingContainer = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 27% 12% 30% auto;
    & > p {
        width: 25%;
    }
    & > svg {
        cursor: pointer;
        & > path {
            color: #049be5;
            &:hover {
                color: #007fbe;
            }
        }
    }
`;

export default function CompactBookings(props: { futureBookings: Booking[] }) {
    const { defaultLocation, futureBookings } = useAppState();
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        let futureOtherOfficeBookings: Booking[] = [];
        for (const futureBooking of props.futureBookings) {
            if (futureBooking.location !== defaultLocation) {
                futureOtherOfficeBookings.push(futureBooking);
            }
        }
        setBookings(futureOtherOfficeBookings);
    }, [defaultLocation, futureBookings]);

    return (
        <Container>
            <h2>Bokninar på annan ort</h2>
            {bookings.map((booking, idx) => (
                <BookingContainer key={idx}>
                    <p>{booking.location}</p>
                    <p>{booking.partOfDay === 1 ? 'FM' : 'EM'}</p>
                    <p>{booking.date}</p>
                    <FontAwesomeIcon
                        icon={faTrashCan}
                        size="1x"
                        onClick={() => {
                            booking.id &&
                                deleteDoc(
                                    doc(firestore, 'bookings', booking.id!)
                                );
                        }}
                    />
                </BookingContainer>
            ))}
        </Container>
    );
}
