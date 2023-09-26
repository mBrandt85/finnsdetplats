import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import { useAppState } from '../providers/app-state';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

const Container = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-size: 1.25rem;
    background-color: white;
    border-radius: 9999999px;
    box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 15%);
    padding: 2px 10px 2px 2px;

    & > img {
        border-radius: 50%;
        width: 1.75rem;
        height: 1.75rem;
        margin: 0;
        padding: 0;
        box-shadow: 0 0 0.5rem rgba(0, 0, 0, 25%);
    }

    & > p {
        color: #444;
        font-size: 1.1rem;
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
        margin-right: 1rem;
        margin-bottom: 1rem;
    }

    > div {
        display: flex;
        align-items: center;
        gap: 1rem;
        > select {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
            height: 2rem;
        }
    }
`;

export default function UserBadge(props: {
    name: string;
    defaultLocation: string;
    photoUrl: string;
    clicks: number;
    setClicks: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [modal, setModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { user, defaultLocation, setDefaultLocation, setCurrentLocation } =
        useAppState();
    const [selectedLocation, setSelectedLocation] = useState(
        defaultLocation ? defaultLocation : 'Luleå'
    );
    const options = [
        { value: 'Luleå', text: 'Luleå' },
        { value: 'Umeå', text: 'Umeå' },
        { value: 'Östersund', text: 'Östersund' },
    ];

    async function handleChangeDefaultLocation() {
        setLoading(true);

        await setDoc(
            doc(
                firestore,
                'employeeDefaultLocations',
                user?.uid ? user.uid : 'id'
            ),
            {
                location: selectedLocation,
            }
        );

        setLoading(false);
    }

    return (
        <>
            <Container>
                <img
                    src={props.photoUrl}
                    onClick={() => props.setClicks(props.clicks + 1)}
                />
                <p>{props.name},</p>
                <p>
                    {props.defaultLocation ? props.defaultLocation : 'Hemlös'}
                </p>
                <FontAwesomeIcon
                    icon={faPen}
                    size="2xs"
                    style={{ color: '#049be5' }}
                    onClick={() => setModal(!modal)}
                />
            </Container>
            {modal && (
                <Modal
                    close={() => setModal(!modal)}
                    isDefaultLocationModal={true}
                >
                    <header>
                        <h1>Byt ordinarie ort</h1>
                    </header>
                    <ModalContainer>
                        <p>
                            Välj din placeringsort. Du kan fortfarande boka
                            platser på andra kontor.
                        </p>
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
                                handleChangeDefaultLocation();
                                setModal(!modal);
                            }}
                        >
                            Välj
                        </Button>
                    </ModalContainer>
                </Modal>
            )}
        </>
    );
}
