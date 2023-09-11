import styled from 'styled-components';

interface SelectOption {
    value: string;
    text: string;
}

interface Props {
    label: string;
    options: SelectOption[];
}

const Container = styled.div`
    display: flex;
    flex-direction: column;

    > label {
        font-size: 1.2rem;
    }

    > select {
        padding-left: 0%.75;
        height: 2rem;
    }
`;

export default function Select({ label, options }: Props) {
    return (
        <Container>
            <label htmlFor="select-town">{label}</label>
            <select id="select-town" name="select-town">
                {options.map((item) => (
                    <option value={item.value}>{item.text}</option>
                ))}
            </select>
        </Container>
    );
}
