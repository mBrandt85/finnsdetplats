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
import Card from './card';
import Loading from './loading';
import Navigate from './navigate';
import NotOk from './not-ok';
import DarkMode from './darkmode';
import Background from './background';
import Select from './select';

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

        .buttons {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            gap: 1rem;
        }

        > div > .rightButtons {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        > span {
            padding: 1rem 0 0 1rem;
            color: white;
            text-shadow: 0.1rem 0.1rem 0 rgba(0, 0, 0, 25%);
        }
    }
`;

const UserBadge = styled.div`
    display: flex;
    align-items: center;
    padding: 2px 0;
    font-size: 1.25rem;
    background-color: white;
    border-radius: 9999999px;
    box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 15%);

    & > img {
        border-radius: 50%;
        width: 1.75rem;
        height: 1.75rem;
        margin-left: 0.2rem;
        box-shadow: 0 0 0.5rem rgba(0, 0, 0, 25%);
    }

    & > .display-name {
        color: #444;
        font-size: 1.1rem;
        padding: 0 0.75rem 0 0.5rem;
    }
`;

export default function View() {
    const {
        user,
        clearUser,
        week,
        setLocation,
        bookings,
        addBooking,
        removeBooking,
        lightmode,
    } = useAppState();
    const [loading, setLoading] = useState<boolean>(true);
    const [clicks, setClicks] = useState<number>(0);

    const logout = async () => {
        await signOut(auth);
        clearUser();
    };

    async function fetchLocation() {
        const uid = user?.uid ? user.uid : 'default';
        const docRef = doc(firestore, 'locations', uid);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await setLocation(docSnap.data().location);
        } else {
            console.log('No such document!');
        }
    }

    useEffect(() => {
        fetchLocation();
    }, []);

    useEffect(() => {
        if (clicks === 10) logout();
        // eslint-disable-next-line
    }, [clicks]);

    useEffect(() => {
        let unsub: Unsubscribe;
        setLoading(true);
        try {
            unsub = onSnapshot(
                query(
                    collection(firestore, 'bookings'),
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
    }, [week]);

    if (loading) return <Loading text="Hämtar bokningar..." />;

    if (!user) return <NotOk />;

    return (
        <>
            <Background />
            <Container>
                <header>
                    <span>Finns det plats?</span>
                    <div className="buttons">
                        <Select
                            label={'Välj stad'}
                            options={[
                                { value: 'lulea', text: 'Luleå' },
                                { value: 'umea', text: 'Umeå' },
                                { value: 'ostersund', text: 'Östersund' },
                            ]}
                        />
                        <div className="rightButtons">
                            <DarkMode />
                            <UserBadge onClick={() => setClicks(clicks + 1)}>
                                <img
                                    src={
                                        user!.photoURL!
                                    } /*alt={user!.displayName!}*/
                                />
                                <div className="display-name">
                                    {user!.displayName!.split(' ')[0]}
                                </div>
                                <span></span>
                            </UserBadge>
                        </div>
                    </div>
                </header>

                <main>
                    {week.map(({ date }, idx) => {
                        return (
                            <>
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
                            </>
                        );
                    })}
                </main>

                <Navigate />
            </Container>
        </>
    );
}
