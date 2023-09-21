import { createContext, ReactNode, useContext, useReducer } from 'react';
import { User } from 'firebase/auth';
import { LightMode } from '../components/DarkMode';

interface AppStateContext {
    user: User | null;
    week: Day[];
    locations: Location[];
    currentLocation: string;
    defaultLocation: string;
    bookings: Booking[];
    lightmode: LightMode;
    setUser: (payload: User) => void;
    clearUser: () => void;
    setWeek: (payload: Day[]) => void;
    setCurrentLocation: (payload: string) => void;
    setDefaultLocation: (payload: string) => void;
    addBooking: (payload: Booking) => void;
    removeBooking: (payload: string) => void;
    setLightMode: (payload: LightMode) => void;
}

interface AppStateAction {
    type:
        | 'SET_USER'
        | 'CLEAR_USER'
        | 'SET_WEEK'
        | 'SET_LOCATION'
        | 'SET_DEFAULT_LOCATION'
        | 'ADD_BOOKING'
        | 'REMOVE_BOOKING'
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
    const clearUser = () => dispatch({ type: 'CLEAR_USER' });
    const setWeek = (payload: Day[]) => dispatch({ type: 'SET_WEEK', payload });
    const setCurrentLocation = (payload: string) =>
        dispatch({ type: 'SET_LOCATION', payload });
    const setDefaultLocation = (payload: string) =>
        dispatch({ type: 'SET_DEFAULT_LOCATION', payload });
    const addBooking = (payload: Booking) =>
        dispatch({ type: 'ADD_BOOKING', payload });
    const removeBooking = (payload: string) =>
        dispatch({ type: 'REMOVE_BOOKING', payload });
    const setLightMode = (payload: LightMode) => {
        localStorage.setItem('lightmode', payload);
        return dispatch({ type: 'SET_LIGHTMODE', payload });
    };

    const [state, dispatch] = useReducer(reducer, {
        user: null,
        week: [],
        locations: [
            { value: 'Luleå', text: 'Luleå' },
            { value: 'Umeå', text: 'Umeå' },
            { value: 'Östersund', text: 'Östersund' },
        ],
        currentLocation: { location: '' },
        defaultLocation: { location: '' },
        bookings: [],
        lightmode: (localStorage.getItem('lightmode') as LightMode) ?? 'light',
        setUser,
        clearUser,
        setWeek,
        setCurrentLocation,
        setDefaultLocation,
        addBooking,
        removeBooking,
        setLightMode,
    });

    return <AppState.Provider value={state}>{children}</AppState.Provider>;
}

export const useAppState = () => useContext(AppState);
