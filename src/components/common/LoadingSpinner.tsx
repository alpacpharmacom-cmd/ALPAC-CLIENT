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
        minHeight: fullScreen ? '100vh' : '300px',
        width: '100%',
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
