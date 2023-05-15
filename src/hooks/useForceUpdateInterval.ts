import { useEffect, useReducer } from 'react';

const useForceUpdateInterval = ({ seconds }: { seconds: number }) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    setInterval(forceUpdate, seconds * 1000);
  }, []);
};

export default useForceUpdateInterval;
