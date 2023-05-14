import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import styled from 'styled-components';

type LightMode = 'dark' | 'light';

const Button = styled.button<{ mode: LightMode }>`
  width: calc(1.75rem + 4px);
  height: calc(1.75rem + 4px);
  appearance: none;
  border: none;
  border-radius: 50%;
  overflow: hidden;

  &:hover {
    cursor: pointer;
  }

  .icons {
    transform: ${({ mode }) =>
      mode === 'dark' ? 'translateY(0)' : 'translateY(-50%)'};
    transition: transform 300ms;
    display: flex;
    flex-direction: column;
    height: 200%;
    justify-content: space-around;

    .icon {
      /* transform: scale(1.3); */
      transition: transform 1s;
      transform: ${({ mode }) =>
        mode === 'dark'
          ? 'rotate(-20deg) scale(1.2)'
          : 'rotate(60deg) scale(1.2)'};
    }
  }
`;

const DarkMode = () => {
  const [mode, setMode] = useState<LightMode>('dark');
  return (
    <Button
      mode={mode}
      onClick={() => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))}
    >
      <div className='icons'>
        <FontAwesomeIcon className='icon' icon={faMoon} color='#000' />
        <FontAwesomeIcon className='icon' icon={faSun} color='orange' />
      </div>
    </Button>
  );
};

export default DarkMode;
