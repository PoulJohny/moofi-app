import { useEffect, useState } from 'react';

const useIsNightMode = () => {
  const key = 'theme';
  const light = 'light';
  const dark = 'dark';
  const [isNightMode, setNightMode] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(key, isNightMode ? dark : light);
    } catch (e) {}
  }, [isNightMode]);

  return { isNightMode, setNightMode };
};

export default useIsNightMode;
