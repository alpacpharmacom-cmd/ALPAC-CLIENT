import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

export default function AmbientBackground() {
  return (
    <MotionBox 
      animate={{ 
        opacity: [0.3, 0.4, 0.3],
      }}
      transition={{ 
        duration: 10, 
        repeat: Infinity, 
        ease: 'easeInOut' 
      }}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        pointerEvents: 'none',
        background: 'linear-gradient(-45deg, #f9f7f2, #f5f3ec, #fdfcf9, #f9f7f2)',
        backgroundSize: '400% 400%',
        willChange: 'opacity',
        display: { xs: 'none', md: 'block' } // Hide it on mobile for maximum performance
      }}
    />
  );
}
