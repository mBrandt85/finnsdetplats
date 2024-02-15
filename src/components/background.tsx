import styled from 'styled-components';
import { useAppState } from '../providers/app-state';

const BG = styled.div`
  position: absolute;
  inset: 0;

  &.dark {
    div.light {
      opacity: 0;
    }
  }
  &.light {
    div.dark {
      opacity: 0;
    }
  }

  div {
    inset: 0;
    position: absolute;
    transition: opacity 300ms;
  }
  div.light {
    background-color: rgb(144, 165, 171);
  }
  div.dark {
    background-image: linear-gradient(180deg, #040408, #080710, #040408);
  }
  /* background-color: red; */
`;

const Background = () => {
  const { lightmode } = useAppState();
  return (
    <BG className={lightmode}>
      <div className='light'></div>
      <div className='dark'></div>
    </BG>
  );
};

export default Background;
