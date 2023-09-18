import styled from 'styled-components';
import { useAppState } from '../providers/app-state';

interface SelectOption {
    value: string;
    text: string;
}

interface Props {
    options: SelectOption[];
    isDefaultModal: boolean;
}

const Container = styled.div`
    display: flex;
    gap: 6px;
    > label {
        font-size: 1.1rem;
    }

    > select {
        padding-left: 0.75rem;
        padding-right: 0.75rem;
        height: 2rem;
    }

    > button {
        border-radius: 999px;
        border: none;
        &.dark {
            background-color: #3e3277;
        }
        background-color: rgb(6, 155, 229);
        color: white;
        padding: 4px 10px;
        font-weight: 500;
        @media screen and (min-width: 501px) {
            box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 15%);
        }

        @media screen and (max-width: 500px) {
            box-shadow: 0 0 0.25rem rgba(0, 0, 0, 25%);
        }
    }
`;

export default function Select({ options, isDefaultModal }: Props) {
    const { defaultLocation, setLocation } = useAppState();

    return (
        <Container>
            <select
                id="select-town"
                name="select-town"
                defaultValue={defaultLocation}
                onChange={(e) =>
                    isDefaultModal ? null : setLocation(e.target.value)
                }
            >
                {options.map((item, index) => (
                    <option key={index} value={item.value}>
                        {item.text}
                    </option>
                ))}
            </select>
        </Container>
    );
}
