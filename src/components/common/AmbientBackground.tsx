import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

export default function AmbientBackground() {
  return (
    <MotionBox 
      animate={{ 
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{ 
        duration: 20, 
        repeat: Infinity, 
        ease: 'linear' 
      }}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        pointerEvents: 'none',
        background: 'linear-gradient(-45deg, #8ba895, #cabaa6, #7d9e87, #eedfcd, #8ba895)',
        backgroundSize: '400% 400%',
        opacity: 0.4, // User requested 0.4
        willChange: 'background-position',
      }}
    />
  );
}
