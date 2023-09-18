import { faPen } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

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

export default function UserBadge(props: {
    name: string;
    defaultLocation: string;
    photoUrl: string;
}) {
    console.log('Default location in userInfo: ', props.defaultLocation);
    return (
        <Container>
            <img src={props.photoUrl} alt={'' /*user!.displayName!*/} />
            <p>{props.name},</p>
            <p>{props.defaultLocation ? props.defaultLocation : 'Hemlös'}</p>
            <FontAwesomeIcon
                icon={faPen}
                size="2xs"
                style={{ color: '#049be5' }}
                onClick={() => console.log('hej')}
            />
        </Container>
    );
}
