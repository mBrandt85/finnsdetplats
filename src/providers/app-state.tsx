import { createContext, ReactNode, useContext, useReducer } from 'react';
import { User } from 'firebase/auth';
import { LightMode } from '../components/DarkMode';

interface AppStateContext {
    user: User | null;
    hasBookingInOtherOffice: boolean;
    week: Day[];
    numOfSeats: number;
    numOfParkingSpots: number;
    locations: Location[];
    currentLocation: string;
    defaultLocation: string;
    bookings: Booking[];
    lightmode: LightMode;
    setUser: (payload: User) => void;
    clearUser: () => void;
    setWeek: (payload: Day[]) => void;
    setHasBookingInOtherOffice: (payload: boolean) => void;
    setNumOfSeats: (payload: number) => void;
    setNumOfParkingSpots: (payload: number) => void;
    setCurrentLocation: (payload: string) => void;
    setDefaultLocation: (payload: string) => void;
    addBooking: (payload: Booking) => void;
    removeBooking: (payload: string) => void;
    clearBookings: () => void;
    setLightMode: (payload: LightMode) => void;
}

interface AppStateAction {
    type:
        | 'SET_USER'
        | 'SET_HAS_BOOKING_IN_OTHER_OFFICE'
        | 'CLEAR_USER'
        | 'SET_WEEK'
        | 'SET_NUM_OF_SEATS'
        | 'SET_NUM_OF_PARKING_SPOTS'
        | 'SET_LOCATION'
        | 'SET_DEFAULT_LOCATION'
        | 'ADD_BOOKING'
        | 'REMOVE_BOOKING'
        | 'CLEAR_BOOKINGS'
        | 'SET_LIGHTMODE';
    payload?: any;
}

interface Location {
    value: string;
    text: string;
}

export interface Day {
    date: string;
}

export interface Booking {
    id?: string;
    date: string;
    type: 'd' | 'p';
    uid: string;
    location: string;
    displayName: string;
    photoURL: string;
    partOfDay?: number;
}

const reducer = (
    state: AppStateContext,
    action: AppStateAction
): AppStateContext => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload as User,
            };

        case 'SET_HAS_BOOKING_IN_OTHER_OFFICE':
            return {
                ...state,
                hasBookingInOtherOffice: action.payload,
            };

        case 'CLEAR_USER':
            return {
                ...state,
                user: null,
            };

        case 'SET_WEEK':
            return {
                ...state,
                week: action.payload as Day[],
                bookings: [],
            };

        case 'SET_NUM_OF_SEATS':
            return {
                ...state,
                numOfSeats: action.payload,
            };

        case 'SET_NUM_OF_PARKING_SPOTS':
            return {
                ...state,
                numOfParkingSpots: action.payload,
            };

        case 'SET_LOCATION':
            return {
                ...state,
                currentLocation: action.payload,
            };

        case 'SET_DEFAULT_LOCATION':
            return {
                ...state,
                defaultLocation: action.payload,
            };

        case 'ADD_BOOKING':
            return {
                ...state,
                bookings: [...state.bookings, action.payload as Booking],
            };

        case 'REMOVE_BOOKING':
            return {
                ...state,
                bookings: state.bookings.filter(
                    ({ id }) => id !== action.payload
                ),
            };

        case 'CLEAR_BOOKINGS':
            return {
                ...state,
                bookings: [],
            };

        case 'SET_LIGHTMODE':
            return {
                ...state,
                lightmode: action.payload,
            };

        default:
            return state;
    }
};

const AppState = createContext({} as AppStateContext);

export default function AppStateProvider({
    children,
}: {
    children: ReactNode;
}) {
    const setUser = (payload: User) => dispatch({ type: 'SET_USER', payload });
    const setHasBookingInOtherOffice = (payload: boolean) =>
        dispatch({ type: 'SET_HAS_BOOKING_IN_OTHER_OFFICE', payload });
    const clearUser = () => dispatch({ type: 'CLEAR_USER' });
    const setWeek = (payload: Day[]) => dispatch({ type: 'SET_WEEK', payload });
    const setNumOfSeats = (payload: number) =>
        dispatch({ type: 'SET_NUM_OF_SEATS', payload });
    const setNumOfParkingSpots = (payload: number) =>
        dispatch({ type: 'SET_NUM_OF_PARKING_SPOTS', payload });
    const setCurrentLocation = (payload: string) =>
        dispatch({ type: 'SET_LOCATION', payload });
    const setDefaultLocation = (payload: string) =>
        dispatch({ type: 'SET_DEFAULT_LOCATION', payload });
    const addBooking = (payload: Booking) =>
        dispatch({ type: 'ADD_BOOKING', payload });
    const removeBooking = (payload: string) =>
        dispatch({ type: 'REMOVE_BOOKING', payload });
    const clearBookings = () => dispatch({ type: 'CLEAR_BOOKINGS' });
    const setLightMode = (payload: LightMode) => {
        localStorage.setItem('lightmode', payload);
        return dispatch({ type: 'SET_LIGHTMODE', payload });
    };

    const [state, dispatch] = useReducer(reducer, {
        user: null,
        hasBookingInOtherOffice: false,
        week: [],
        numOfSeats: 0,
        numOfParkingSpots: 0,
        locations: [
            { value: 'Luleå', text: 'Luleå' },
            { value: 'Umeå', text: 'Umeå' },
            { value: 'Östersund', text: 'Östersund' },
        ],
        currentLocation: '',
        defaultLocation: '',
        bookings: [],
        lightmode: (localStorage.getItem('lightmode') as LightMode) ?? 'light',
        setUser,
        clearUser,
        setWeek,
        setHasBookingInOtherOffice,
        setNumOfSeats,
        setNumOfParkingSpots,
        setCurrentLocation,
        setDefaultLocation,
        addBooking,
        removeBooking,
        clearBookings,
        setLightMode,
    });

    return <AppState.Provider value={state}>{children}</AppState.Provider>;
}

export const useAppState = () => useContext(AppState);
