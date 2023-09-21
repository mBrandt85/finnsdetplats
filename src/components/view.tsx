import { signOut, Unsubscribe } from 'firebase/auth';
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { auth, firestore } from '../firebase';
import { Booking, useAppState } from '../providers/app-state';
import { fadeIn } from '../utils/keyframes';
import Loading from './loading';
import NotOk from './NotOk';
import DarkMode from './darkmode';
import UserBadge from './UserBadge';
import Background from './background';
import Card from './card';
import Navigate from './navigate';

const Container = styled.div`
    margin: 0 auto;
    width: 100%;
    width: min-content;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;

    @media screen and (max-width: 500px) {
        /* position: absolute; */
    }

    & > main {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        > :first-child {
            margin-top: 2rem;
        }

        .seperator {
            &.dark {
                background-color: #ddd;
            }
            margin: 0 auto;
            margin-bottom: 0.5rem;
            width: 40px;
            height: 5px;
            border-radius: 999999px;
            background-color: black;
            opacity: 0.2;
        }

        @media screen and (max-width: 500px) {
            padding-bottom: 5rem;
        }
    }

    & > header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem 0 0;
        font-family: 'Roboto Condensed', sans-serif;
        font-weight: 400;
        font-size: 1.6rem;
        letter-spacing: -0.025rem;
        animation-name: ${fadeIn};
        -webkit-animation-name: ${fadeIn};
        animation-duration: 0.3s;
        -webkit-animation-duration: 0.3s;
        animation-timing-function: ease-in;
        -webkit-animation-timing-function: ease-in;

        .select-label-container {
            width: 100%;
            padding-left: 1rem;
            & > label {
                font-size: 1rem;
            }
        }

        .buttons {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            gap: 1rem;
            padding-left: 1rem;

            > select {
                padding-left: 0.75rem;
                padding-right: 0.75rem;
                height: 2rem;
            }
        }

        > div > .rightButtons {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        > h1 {
            padding: 1rem 0 0 1rem;
            font-size: 2rem;
            color: white;
            text-shadow: 0.1rem 0.1rem 0 rgba(0, 0, 0, 25%);
        }
    }
`;

export default function View() {
    const {
        user,
        clearUser,
        week,
        numOfSeats,
        numOfParkingSpots,
        setNumOfSeats,
        setNumOfParkingSpots,
        locations,
        currentLocation,
        setCurrentLocation,
        defaultLocation,
        setDefaultLocation,
        bookings,
        addBooking,
        removeBooking,
        clearBookings,
        lightmode,
    } = useAppState();
    const [loading, setLoading] = useState<boolean>(true);
    const [clicks, setClicks] = useState<number>(0);

    const uid = user?.uid ? user.uid : 'default';

    const logout = async () => {
        await signOut(auth);
        clearUser();
    };

    async function fetchDefaultLocation() {
        const docRef = doc(firestore, 'employeeDefaultLocations', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setDefaultLocation(docSnap.data().location);
            setCurrentLocation(docSnap.data().location);
            fetchLocation(docSnap.data().location);
        } else {
            console.log('No such document!');
        }
    }

    async function fetchLocation(location: string) {
        const docRef = doc(firestore, 'locations', location);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setNumOfParkingSpots(docSnap.data().parkings);
            setNumOfSeats(docSnap.data().seats);
        }

        console.log('Seats: ', numOfSeats);
        console.log('Parkings: ', numOfParkingSpots);
    }

    useEffect(() => {
        fetchDefaultLocation();
    }, []);

    useEffect(() => {
        if (clicks === 10) logout();
        // eslint-disable-next-line
    }, [clicks]);

    useEffect(() => {
        clearBookings();

        let unsub: Unsubscribe;

        setLoading(true);

        try {
            unsub = onSnapshot(
                query(
                    collection(firestore, 'bookings'),
                    where('location', '==', currentLocation),
                    where('date', '>=', week[0].date),
                    where('date', '<=', week[6].date)
                ),
                (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            addBooking({
                                id: change.doc.id,
                                ...(change.doc.data() as Booking),
                            });
                        }

                        if (change.type === 'removed')
                            removeBooking(change.doc.id);
                    });
                    setLoading(false);
                }
            );
        } catch (e) {}

        return () => unsub && unsub();
        // eslint-disable-next-line
    }, [week, currentLocation]);

    useEffect(() => {
        console.log('Current location: ', currentLocation);
    }, [currentLocation]);

    if (loading) return <Loading text="Hämtar bokningar..." />;
    if (!user) return <NotOk />;

    return (
        <>
            <Background />
            <Container>
                <header>
                    <h1>Boka plats</h1>
                    <div className="select-label-container">
                        <label htmlFor="select-town">Välj stad</label>
                    </div>
                    <div className="buttons">
                        <select
                            id="select-town"
                            name="select-town"
                            value={currentLocation}
                            onChange={(e) => {
                                setCurrentLocation(e.target.value);
                                fetchLocation(e.target.value);
                            }}
                        >
                            {locations.map((item, index) => (
                                <option key={index} value={item.value}>
                                    {item.text}
                                </option>
                            ))}
                        </select>

                        <div className="rightButtons">
                            <DarkMode />
                            <UserBadge
                                clicks={clicks}
                                setClicks={setClicks}
                                name={user!.displayName!.split(' ')[0]}
                                defaultLocation={defaultLocation}
                                photoUrl={user!.photoURL!}
                            />
                        </div>
                    </div>
                </header>
                <main>
                    {week.map(({ date }, idx) => {
                        return (
                            <div key={idx}>
                                <Card
                                    key={idx}
                                    date={date}
                                    bookings={bookings.filter(
                                        (booking) => booking.date === date
                                    )}
                                />
                                {idx === 4 && (
                                    <div
                                        className={`${lightmode} seperator`}
                                    ></div>
                                )}
                            </div>
                        );
                    })}
                </main>

                <Navigate />
            </Container>
        </>
    );
}
