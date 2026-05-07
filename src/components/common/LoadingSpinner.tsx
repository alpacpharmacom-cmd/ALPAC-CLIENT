import { Box, CircularProgress, Typography } from '@mui/material';

interface Props {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ message = 'Loading...', fullScreen = false }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullScreen ? {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
        } : {
          flex: 1,
          minHeight: '400px',
          width: '100%',
        })
      }}
    >
      <CircularProgress
        size={36}
        thickness={2}
        sx={{ color: 'primary.main' }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: '0.1em' }}>
        {message}
      </Typography>
    </Box>
  );
}
