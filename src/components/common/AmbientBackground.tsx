import { Box } from '@mui/material';

export default function AmbientBackground() {
  return (
    <Box 
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        pointerEvents: 'none',
        background: 'linear-gradient(-45deg, #8ba895, #cabaa6, #7d9e87, #eedfcd, #8ba895)',
        backgroundSize: '100% 100%',
        opacity: { xs: 0.15, md: 0.3 },
        willChange: 'transform',
        contain: 'strict',
      }}
    />
  );
}
