import { useEffect, useReducer } from 'react';

const useForceUpdateInterval = ({ seconds }: { seconds: number }) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const interval = setInterval(forceUpdate, seconds * 1000);
    return () => clearInterval(interval);
  }, []);
};

export default useForceUpdateInterval;
