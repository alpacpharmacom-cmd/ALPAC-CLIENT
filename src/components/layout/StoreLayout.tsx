import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
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
        component="main" 
        sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', willChange: 'transform, opacity' }}
        >
          <Outlet />
        </motion.div>
      </Box>
      <Footer />
    </Box>
  );
}
