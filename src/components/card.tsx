import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import styled from 'styled-components';

import { Booking, useAppState } from '../providers/app-state';
import { fadeIn } from '../utils/keyframes';
import {
    hasPassed,
    isToday,
    parseDate,
    parseDay,
    parseMonth,
} from '../utils/week';
import Button from './button';
import Modal from './modal';
import useForceUpdateInterval from '../hooks/useForceUpdateInterval';

interface Styled {
    date: string;
}

interface Props extends Styled {
    bookings: Booking[];
}

const Wrapper = styled.div<Styled>`
    opacity: ${({ date }) => (hasPassed(date) ? '0.4' : '1')};
`;

const DateTitle = styled.div<Styled>`
    &.dark {
        .dayname {
            color: white;
        }
        .bottom-row {
            color: #ccc;
        }
        .today-arrow {
            color: orange;
        }

        &:hover {
            background-color: #222;
        }
    }
    display: flex;
    flex-direction: column;
    font-family: 'Roboto Condensed', sans-serif;
    gap: 0.2rem;
    text-transform: uppercase;
    font-weight: 500;
    color: #555;
    padding: 0.2rem;
    border-radius: 0.5rem;
    min-width: 6rem;
    margin-right: 2rem;

    @media screen and (max-width: 500px) {
        margin-right: 0;
    }

    &:hover {
        background-color: #d9d9d9;
        cursor: pointer;
    }

    & .dayname {
        color: black;
        font-size: 1.2rem;
    }

    & .bottom-row {
        display: flex;
        gap: 0.1rem;
    }

    .today-arrow {
        color: rgba(200, 0, 0);
        animation: bounce 1.5s infinite;
        animation-timing-function: cubic-bezier(0.95, 0.05, 0.795, 0.035);
        animation-name: bounce;
        transform: translateX(0.2rem);
    }

    @keyframes bounce {
        0% {
            transform: translateX(0.2rem);
        }
        80% {
            transform: translateX(0.9rem);
        }
        100% {
            transform: translateX(0.2rem);
        }
    }
`;

const Container = styled.div<Styled>`
    &.dark {
        background-color: black;
        color: #ccc;
        outline: #ccc 1px solid;
        box-shadow: none;
        /* margin: -1px; */

        .actions .action-pair.labeled:before {
            background-color: black;
            color: white;
        }
    }

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    background-color: white;
    box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 15%);
    animation-name: ${fadeIn};
    -webkit-animation-name: ${fadeIn};
    animation-duration: 0.3s;
    -webkit-animation-duration: 0.3s;
    animation-timing-function: ease-in;
    -webkit-animation-timing-function: ease-in;
    background-color: white;

    @media screen and (max-width: 500px) {
        width: 100vw;
        border-radius: 0;
    }

    & .actions {
        display: flex;
        gap: 1rem;
        & .left {
            display: flex;
        }

        & .action-pair {
            position: relative;
            display: flex;
            gap: 0.2rem;

            & > div:nth-child(1) {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }
            & > div:nth-child(2) {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }
        & .action-pair.labeled {
            &:before {
                content: 'Kontorsplats';
                background-color: white;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                padding: 0 0.5rem;
                position: absolute;
                top: 0;
                color: #111;
                font-weight: 500;
                font-size: 0.8rem;
                left: 50%;
                transform: translateX(-50%) translateY(-130%);
            }
            &.p:before {
                content: 'Parkering';
            }
        }
    }
`;

const UserDetails = styled.div`
    display: flex;
    align-items: center;
    margin-top: 0.5rem;

    & > img {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
    }

    & > span {
        margin-left: 0.5rem;
        font-weight: 700;
    }
`;

const Main = styled.main`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    & span {
        font-weight: normal;
    }
    h4 {
        margin-top: 0.5rem;
    }
    .name-list {
        display: flex;
        flex-direction: column;
        margin: 0 1rem;
    }
`;

export default function Card({ date, bookings }: Props) {
    const [modal, setModal] = useState<boolean>(false);
    const dayBookings = bookings.filter(({ type }) => type === 'd');
    const dayBookingsPart1 = dayBookings.filter(
        ({ partOfDay }) => partOfDay === undefined || partOfDay === 1
    );
    const dayBookingsPart2 = dayBookings.filter(
        ({ partOfDay }) => partOfDay === 2
    );
    const parkingBookings = bookings.filter(({ type }) => type === 'p');
    const parkingBookingsPart1 = parkingBookings.filter(
        ({ partOfDay }) => partOfDay === undefined || partOfDay === 1
    );
    const parkingBookingsPart2 = parkingBookings.filter(
        ({ partOfDay }) => partOfDay === 2
    );

    const { lightmode } = useAppState();

    useForceUpdateInterval({ seconds: 10 }); // Makes sure "Today" stays fresh when window is open over several days

    return (
        <>
            <Wrapper date={date}>
                <Container className={lightmode} date={date}>
                    <DateTitle
                        className={lightmode}
                        date={date}
                        onClick={() => setModal(!modal)}
                    >
                        <span className="dayname">{parseDay(date)}</span>
                        <div className="bottom-row">
                            <span className="date">{parseDate(date)}</span>
                            <span className="month">{parseMonth(date)}</span>
                            {isToday(date) && (
                                <div className="today-arrow right">
                                    <FontAwesomeIcon icon={faLeftLong} />
                                </div>
                            )}
                        </div>
                    </DateTitle>

                    <div className="actions">
                        <div
                            className={`action-pair ${
                                isToday(date) ? 'labeled' : 'labeled'
                            }`}
                        >
                            <Button
                                type="d"
                                date={date}
                                partOfDay={1}
                                bookings={dayBookingsPart1}
                            />
                            <Button
                                type="d"
                                date={date}
                                partOfDay={2}
                                bookings={dayBookingsPart2}
                            />
                        </div>
                        <div
                            className={`action-pair p ${
                                isToday(date) ? 'labeled' : 'labeled'
                            }`}
                        >
                            <Button
                                type="p"
                                date={date}
                                partOfDay={1}
                                bookings={parkingBookingsPart1}
                            />
                            <Button
                                type="p"
                                date={date}
                                partOfDay={2}
                                bookings={parkingBookingsPart2}
                            />
                        </div>
                    </div>
                </Container>
                {modal && (
                    <Modal close={() => setModal(!modal)}>
                        <header>
                            {parseDay(date) +
                                ' ' +
                                parseDate(date) +
                                ' ' +
                                parseMonth(date)}
                        </header>

                        <Main>
                            <h4>Kontorsplats</h4>
                            <div className="name-list">
                                {dayBookingsPart1.length > 0 && (
                                    <div>
                                        <h5>Förmiddag</h5>
                                        {dayBookingsPart1.map(
                                            (
                                                { displayName, photoURL },
                                                key
                                            ) => (
                                                <UserDetails key={key}>
                                                    <img
                                                        src={photoURL}
                                                        alt={displayName}
                                                    />
                                                    <span>{displayName}</span>
                                                </UserDetails>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="name-list">
                                {dayBookingsPart2.length > 0 && (
                                    <div>
                                        <h5>Eftermiddag</h5>
                                        {dayBookingsPart2.map(
                                            (
                                                { displayName, photoURL },
                                                key
                                            ) => (
                                                <UserDetails key={key}>
                                                    <img
                                                        src={photoURL}
                                                        alt={displayName}
                                                    />
                                                    <span>{displayName}</span>
                                                </UserDetails>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            <h4>Parkering</h4>
                            <div className="name-list">
                                {parkingBookingsPart1.length > 0 && (
                                    <div>
                                        <h5>Förmiddag</h5>
                                        {parkingBookingsPart1.map(
                                            (
                                                { displayName, photoURL },
                                                key
                                            ) => (
                                                <UserDetails key={key}>
                                                    <img
                                                        src={photoURL}
                                                        alt={displayName}
                                                    />
                                                    <span>{displayName}</span>
                                                </UserDetails>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="name-list">
                                {parkingBookingsPart2.length > 0 && (
                                    <div>
                                        <h5>Eftermiddag</h5>
                                        {parkingBookingsPart2.map(
                                            (
                                                { displayName, photoURL },
                                                key
                                            ) => (
                                                <UserDetails key={key}>
                                                    <img
                                                        src={photoURL}
                                                        alt={displayName}
                                                    />
                                                    <span>{displayName}</span>
                                                </UserDetails>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </Main>
                    </Modal>
                )}
            </Wrapper>
        </>
    );
}
