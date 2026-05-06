import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import { Instagram, YouTube, Facebook, X, Pinterest } from '@mui/icons-material';

const socialLinks = [
  { Icon: Instagram, label: 'Instagram', href: '#' },
  { Icon: Facebook, label: 'Facebook', href: '#' },
  { Icon: X, label: 'X', href: '#' },
  { Icon: YouTube, label: 'YouTube', href: '#' },
  { Icon: Pinterest, label: 'Pinterest', href: '#' },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0d0d0d',
        color: 'rgba(255,255,255,0.8)',
        mt: 'auto',
      }}
    >
      {/* Top decorative divider */}
      <Box
        sx={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(184,149,106,0.35), transparent)',
        }}
      />

      {/* Main Footer Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={{ xs: 4, md: 5 }}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '1.6rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'white',
                mb: 2,
              }}
            >
              Alpac
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.8,
                maxWidth: 280,
                fontSize: '0.85rem',
              }}
            >
              Premium natural skincare crafted with the finest ingredients.
              Your skin deserves the best nature has to offer.
            </Typography>
          </Grid>

          {/* Quick Links */}
          {[
            {
              title: 'Shop',
              links: [
                { label: 'Shop All', path: '/shop' },
                { label: 'New Arrivals', path: '/shop' },
                { label: 'Best Sellers', path: '/shop' },
                { label: 'About Us', path: '/about' },
              ],
            },
            {
              title: 'Account',
              links: [
                { label: 'My Profile', path: '/profile' },
                { label: 'My Orders', path: '/orders' },
                { label: 'Shopping Cart', path: '/cart' },
                { label: 'Sign In', path: '/login' },
              ],
            },
            {
              title: 'Support',
              links: [
                { label: 'Contact Us', path: '#' },
                { label: 'FAQ', path: '#' },
                { label: 'Shipping Info', path: '#' },
                { label: 'Returns', path: '#' },
              ],
            },
          ].map((section) => (
            <Grid size={{ xs: 6, sm: 3, md: 2 }} key={section.title}>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  mb: 2.5,
                  fontWeight: 700,
                  fontSize: '0.62rem',
                }}
              >
                {section.title}
              </Typography>
              {section.links.map((item) => (
                <Typography
                  key={item.label}
                  component={Link}
                  to={item.path}
                  sx={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.84rem',
                    mb: 1.5,
                    textDecoration: 'none',
                    transition: 'none',
                    '&:hover': { color: '#d4b896' },
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Grid>
          ))}

          {/* Follow Us */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                mb: 2.5,
                fontWeight: 700,
                fontSize: '0.62rem',
              }}
            >
              Follow Us
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.84rem',
                lineHeight: 1.7,
                mb: 2.5,
              }}
            >
              Stay connected for the latest drops, tips, and exclusive offers.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map(({ Icon, label, href }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={href}
                  aria-label={label}
                  size="small"
                  sx={{
                    color: 'rgba(255,255,255,0.4)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    width: 36,
                    height: 36,
                    '&:hover': {
                      color: '#b8956a',
                      borderColor: 'rgba(184,149,106,0.35)',
                      bgcolor: 'rgba(184,149,106,0.08)',
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 16 }} />
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Bottom Bar */}
      <Box
        sx={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          py: 2.5,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              flexWrap: 'wrap',
              gap: { xs: 3, md: 1.5 },
            }}
          >
            <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem' }}>
              © {new Date().getFullYear()} Alpac. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2.5, md: 3.5 } }}>
              {['Privacy Policy', 'Terms of Service', 'Shipping Policy'].map((item) => (
                <Typography
                  key={item}
                  sx={{
                    color: 'rgba(255,255,255,0.25)',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    '&:hover': { color: 'rgba(255,255,255,0.5)' },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
