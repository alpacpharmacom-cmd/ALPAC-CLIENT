import { Box, Typography, Container, Stack, Link } from '@mui/material';
import { Instagram, Facebook, X } from '@mui/icons-material';

export default function AnnouncementBar() {
  return (
    <Box
      sx={{
        bgcolor: '#0a0a0a',
        color: 'rgba(255,255,255,0.7)',
        py: 0.8,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        zIndex: 1200,
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction="row"
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            px: { xs: 0, md: 2 }
          }}
        >
          {/* Email */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Typography
              component="a"
              href="mailto:info@alpacpharma.com"
              sx={{
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'lowercase',
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                '&:hover': { color: 'secondary.main' },
                fontFamily: '"DM Sans", sans-serif',
              }}
            >
              info@alpacpharma.com
            </Typography>
          </Box>

          {/* Slogan or Welcome */}
          <Typography
            sx={{
              display: { xs: 'none', md: 'block' },
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: '"DM Sans", sans-serif',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}
          >
            Your Health, Our Mission.
          </Typography>

          {/* Social Icons */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Stack 
              direction="row" 
              spacing={2.5} 
              sx={{ alignItems: 'center' }}
            >
              <Link 
                href="#" 
                target="_blank" 
                sx={{ 
                  color: 'rgba(255,255,255,0.5)', 
                  display: 'flex',
                  '&:hover': { color: 'secondary.main' }
                }}
              >
                <Instagram sx={{ fontSize: 14 }} />
              </Link>
              <Link 
                href="#" 
                target="_blank" 
                sx={{ 
                  color: 'rgba(255,255,255,0.5)', 
                  display: 'flex',
                  '&:hover': { color: 'secondary.main' }
                }}
              >
                <Facebook sx={{ fontSize: 14 }} />
              </Link>
              <Link 
                href="#" 
                target="_blank" 
                sx={{ 
                  color: 'rgba(255,255,255,0.5)', 
                  display: 'flex',
                  '&:hover': { color: 'secondary.main' }
                }}
              >
                <X sx={{ fontSize: 13 }} />
              </Link>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
