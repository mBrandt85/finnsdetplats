import { signOut, Unsubscribe, User } from 'firebase/auth';
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    setDoc,
    where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { auth, firestore } from '../firebase';
import { Booking, useAppState } from '../providers/app-state';
import { fadeIn } from '../utils/keyframes';
import Loading from './Loading';
import NotOk from './NotOk';
import DarkMode from './DarkMode';
import UserBadge from './UserBadge';
import Background from './Background';
import Card from './Card';
import Navigate from './Navigate';
import Modal from './Modal';
import { getISOWeek, isWeekend } from '../utils/week';

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

const Button = styled.div`
    background-color: rgb(6, 155, 229);
    border-radius: 999px;
    padding: 0.5rem 1rem;
    width: fit-content;
    color: white;
`;

const ModalContainer = styled.div`
    margin-top: 1rem;

    > p {
        font-size: 0.85rem;
        margin-right: 3rem;
        margin-bottom: 1rem;
    }

    > div {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
`;

const Select = styled.select`
    box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 15%);
`;

const Label = styled.label`
    &.dark {
        color: white;
    }
    color: black;
`;

export async function handleChangeDefaultLocation(
    user: User | null,
    selectedLocation: string
) {
    await setDoc(
        doc(firestore, 'employeeDefaultLocations', user?.uid ? user.uid : 'id'),
        {
            location: selectedLocation,
        }
    );
}

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
    const [modal, setModal] = useState<boolean>(false);
    const [selectedLocation, setSelectedLocation] = useState(
        defaultLocation ? defaultLocation : 'Luleå'
    );

    const options = [
        { value: 'Luleå', text: 'Luleå' },
        { value: 'Umeå', text: 'Umeå' },
        { value: 'Östersund', text: 'Östersund' },
    ];
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
            setCurrentLocation('Luleå');
            fetchLocation('Luleå');
            setModal(true);
        }
    }

    async function fetchLocation(location: string) {
        const docRef = doc(firestore, 'locations', location);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setNumOfParkingSpots(docSnap.data().parkings);
            setNumOfSeats(docSnap.data().seats);
        }
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

    if (loading) return <Loading text="Hämtar bokningar..." />;
    if (!user) return <NotOk />;

    return (
        <>
            <Background />
            <Container>
                <header>
                    <h1>
                        {currentLocation}, vecka {getISOWeek(week[0].date)}
                    </h1>
                    <div className="select-label-container">
                        <Label className={lightmode} htmlFor="select-town">
                            Välj stad
                        </Label>
                    </div>
                    <div className="buttons">
                        <Select
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
                        </Select>

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
                        if (!isWeekend(date)) {
                            return (
                                <div key={idx}>
                                    <Card
                                        key={idx}
                                        date={date}
                                        bookings={bookings.filter(
                                            (booking) => booking.date === date
                                        )}
                                    />
                                </div>
                            );
                        }
                    })}
                </main>

                <Navigate />
            </Container>
            {modal && (
                <Modal
                    close={() => setModal(false)}
                    isDefaultLocationModal={true}
                >
                    <header>
                        <h1>Välj ordinarie ort</h1>
                    </header>
                    <ModalContainer>
                        <p>
                            Välj din placeringsort. Du kan fortfarande boka
                            platser på andra kontor.
                        </p>
                        <div>
                            <select
                                id="select-town"
                                name="select-town"
                                defaultValue={defaultLocation}
                                onChange={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedLocation(e.target.value);
                                }}
                            >
                                {options.map((item, index) => (
                                    <option key={index} value={item.value}>
                                        {item.text}
                                    </option>
                                ))}
                            </select>
                            <Button
                                onClick={() => {
                                    setDefaultLocation(selectedLocation);
                                    setCurrentLocation(selectedLocation);
                                    handleChangeDefaultLocation(
                                        user,
                                        selectedLocation
                                    );
                                    setModal(false);
                                }}
                            >
                                Välj
                            </Button>
                        </div>
                    </ModalContainer>
                </Modal>
            )}
        </>
    );
}
