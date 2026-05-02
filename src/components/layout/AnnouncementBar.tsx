import { Box, Typography } from '@mui/material';

const items = [
  'Natural Ingredients',
  '✦',
  'Cruelty Free',
  '✦',
  'Paraben Free',
  '✦',
  'Eco-Friendly',
  '✦',
  'Dermatologist Tested',
  '✦',
  'Vegan Formulas',
  '✦',
];

export default function AnnouncementBar() {
  const repeatedItems = [...items, ...items];

  return (
    <Box
      sx={{
        bgcolor: '#111111',
        color: 'rgba(255,255,255,0.85)',
        py: 1.1,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        position: 'relative',
        zIndex: 1200,
        width: '100%',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: 'max-content',
          animation: 'marquee 40s linear infinite',
          willChange: 'transform',
          '&:hover': { animationPlayState: 'paused' },
        }}
      >
        {repeatedItems.map((item, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 4,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontFamily: '"DM Sans", sans-serif',
                color: item === '✦' ? '#b8956a' : 'rgba(255,255,255,0.75)',
              }}
            >
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
