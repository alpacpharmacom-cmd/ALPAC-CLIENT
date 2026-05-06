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
        bgcolor: { xs: '#fdfbf7', md: 'transparent' },
        background: { 
          xs: 'none', 
          md: 'linear-gradient(135deg, #fdfbf7 0%, #f5f3ec 100%)' 
        },
      }}
    />
  );
}
