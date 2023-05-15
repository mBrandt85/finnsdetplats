import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { useAppState } from '../providers/app-state';

export type LightMode = 'dark' | 'light';

const Button = styled.button<{ mode: LightMode }>`
  width: calc(1.75rem + 4px);
  height: calc(1.75rem + 4px);
  appearance: none;
  border: none;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 15%);

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
      transition-delay: 300ms;
      transform: ${({ mode }) =>
        mode === 'dark'
          ? 'rotate(-20deg) scale(1.2)'
          : 'rotate(60deg) scale(1.2)'};
    }
  }
`;

const DarkMode = () => {
  const { lightmode, setLightMode } = useAppState();
  return (
    <Button
      mode={lightmode}
      onClick={() => setLightMode(lightmode === 'dark' ? 'light' : 'dark')}
    >
      <div className='icons'>
        <FontAwesomeIcon className='icon' icon={faMoon} color='#333' />
        <FontAwesomeIcon className='icon' icon={faSun} color='orange' />
      </div>
    </Button>
  );
};

export default DarkMode;
