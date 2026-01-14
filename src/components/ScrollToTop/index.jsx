import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // 'smooth' behavior can be used if desired
    });
  }, [location.pathname]);

  return null;
};

export default ScrollToTop;
