import { Box, Container, Grid, Skeleton, Stack } from '@mui/material';
import CardSkeleton from './CardSkeleton';

/**
 * Store Shop Skeleton
 * High-fidelity representation of the ShopPage.tsx
 */
export default function StoreShopSkeleton() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Immersive Shop Header Skeleton */}
      <Box
        sx={{
          bgcolor: 'primary.dark',
          pt: { xs: 3, md: 10 },
          pb: { xs: 3, md: 10 },
          textAlign: 'center',
          color: 'white',
          backgroundImage: 'linear-gradient(180deg, rgba(26,46,31,1) 0%, rgba(45,75,56,0.95) 100%)',
        }}
      >
        <Container maxWidth="md">
          <Skeleton width={120} height={20} sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Skeleton width="60%" height={80} sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Skeleton width="80%" height={24} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.05)' }} />
        </Container>
      </Box>

      {/* Main Content Area Skeleton */}
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 8 }, py: { xs: 3, md: 6 } }}>
        <Grid container spacing={6}>
          {/* Sidebar Skeleton */}
          <Grid component="div" size={{ xs: 0, lg: 3 }}>
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Stack spacing={4}>
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: '12px' }} />
                <Box>
                  <Skeleton width={100} height={20} sx={{ mb: 2 }} />
                  <Stack spacing={1}>
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} height={40} sx={{ borderRadius: '10px' }} />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Skeleton width={100} height={20} sx={{ mb: 2 }} />
                  <Stack spacing={1}>
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} variant="rectangular" height={32} sx={{ borderRadius: '10px' }} />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Product Grid Area Skeleton */}
          <Grid component="div" size={{ xs: 12, lg: 9 }}>
            {/* Toolbar Skeleton */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
              <Skeleton width={120} height={24} />
              <Skeleton variant="rectangular" width={180} height={40} sx={{ borderRadius: '12px' }} />
            </Box>

            <Grid container spacing={4}>
              {[...Array(8)].map((_, i) => (
                <Grid component="div" size={{ xs: 6, sm: 4 }} key={i}>
                   <CardSkeleton />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
