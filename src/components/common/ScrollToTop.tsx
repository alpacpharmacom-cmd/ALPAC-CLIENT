import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force scroll to top immediately on route change
    window.scrollTo(0, 0);
    // Some browsers or layouts might require documentElement scroll
    if (document.documentElement) {
      document.documentElement.scrollTo(0, 0);
    }
    // Also handle possible main container scroll
    const main = document.querySelector('main');
    if (main) {
      main.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
