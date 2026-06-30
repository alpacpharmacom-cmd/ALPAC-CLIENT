import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import AmbientBackground from '../common/AmbientBackground';

export default function StoreLayout() {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <AmbientBackground />
      <AnnouncementBar />
      <Navbar />
      <Box 
        key={location.pathname}
        component="main" 
        className="page-transition"
        sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
