import { Box, Container, Grid, Skeleton, Stack } from '@mui/material';
import CardSkeleton from './CardSkeleton';

/**
 * StoreShopSkeleton — mirrors ShopPage.tsx precisely.
 *
 * Layout:
 *  1. Dark green header (title, subtitle)
 *  2. Main content:
 *     – Desktop sidebar (lg:3): search, categories, price ranges, sort chips, reset btn
 *     – Product grid area (lg:9):
 *       · Toolbar: [Filter btn (mobile) | results count] [Sort select (desktop)]
 *       · Product card grid (xs:6 / sm:4)
 */
export default function StoreShopSkeleton() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent' }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <Box
        sx={{
          bgcolor: 'primary.dark',
          pt: { xs: 2, md: 10 },
          pb: { xs: 2, md: 10 },
          textAlign: 'center',
          backgroundImage: 'linear-gradient(180deg, rgba(26,46,31,1) 0%, rgba(45,75,56,0.95) 100%)',
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          {/* h1 title */}
          <Skeleton
            variant="rounded"
            width="55%"
            sx={{ height: { xs: 48, md: 80 }, mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
            animation="wave"
          />
          {/* subtitle */}
          <Skeleton
            variant="rounded"
            width="75%"
            sx={{ height: { xs: 20, md: 28 }, mx: 'auto', bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}
            animation="wave"
          />
        </Container>
      </Box>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <Container maxWidth={false} sx={{ px: { xs: 1.5, md: 6, lg: 8 }, py: { xs: 2, md: 6 } }}>
        <Grid container spacing={{ xs: 2, md: 6 }}>

          {/* ── Sidebar (desktop only) ──────────────────────────── */}
          <Grid component="div" size={{ lg: 3, xl: 2.5 }}>
            <Box sx={{ display: { xs: 'none', lg: 'block' }, position: 'sticky', top: 100 }}>
              <Stack spacing={4}>
                {/* Search field */}
                <Skeleton variant="rounded" height={40} sx={{ borderRadius: '12px' }} animation="wave" />

                {/* Categories */}
                <Box>
                  <Skeleton variant="text" width={90} height={20} sx={{ mb: 1.5 }} animation="wave" />
                  <Stack spacing={0.5}>
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} variant="rounded" height={40} sx={{ borderRadius: '10px' }} animation="wave" />
                    ))}
                  </Stack>
                </Box>

                {/* Price range */}
                <Box>
                  <Skeleton variant="text" width={90} height={20} sx={{ mb: 1.5 }} animation="wave" />
                  <Stack spacing={1}>
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} variant="rounded" height={36} sx={{ borderRadius: '10px' }} animation="wave" />
                    ))}
                  </Stack>
                </Box>

                {/* Sort by */}
                <Box>
                  <Skeleton variant="text" width={65} height={20} sx={{ mb: 1.5 }} animation="wave" />
                  <Stack spacing={1}>
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} variant="rounded" height={36} sx={{ borderRadius: '10px' }} animation="wave" />
                    ))}
                  </Stack>
                </Box>

                {/* Reset btn */}
                <Skeleton variant="rounded" height={48} sx={{ borderRadius: '12px' }} animation="wave" />
              </Stack>
            </Box>
          </Grid>

          {/* ── Product Grid Area ───────────────────────────────── */}
          <Grid component="div" size={{ xs: 12, lg: 9, xl: 9.5 }}>
            {/* Toolbar */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: { xs: 2.5, md: 4 },
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              {/* Left: mobile filter btn + results count */}
              <Stack direction="column" spacing={1} sx={{ width: { xs: '100%', lg: 'auto' } }}>
                {/* "Filter & Sort" button — visible on mobile only */}
                <Box sx={{ display: { xs: 'flex', lg: 'none' }, gap: 1 }}>
                  <Skeleton variant="rounded" height={38} sx={{ borderRadius: '10px', flex: 1 }} animation="wave" />
                </Box>
                {/* Mobile search bar */}
                <Box sx={{ display: { xs: 'flex', lg: 'none' }, gap: 1 }}>
                  <Skeleton variant="rounded" height={40} sx={{ borderRadius: '10px', flex: 1 }} animation="wave" />
                  <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: '10px', flexShrink: 0 }} animation="wave" />
                </Box>
                {/* Results count caption */}
                <Skeleton variant="text" width={90} height={18} sx={{ ml: 0.5 }} animation="wave" />
              </Stack>

              {/* Right: sort select (desktop) */}
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2, alignItems: 'center' }}>
                <Skeleton variant="text" width={55} height={18} animation="wave" />
                <Skeleton variant="rounded" width={180} height={40} sx={{ borderRadius: '12px' }} animation="wave" />
              </Box>
            </Box>

            {/* Product cards */}
            <Grid container spacing={{ xs: 2, sm: 4 }}>
              {[...Array(9)].map((_, i) => (
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
