import { Box, Container, Grid, Skeleton, Stack, Divider, Card } from '@mui/material';

/**
 * StoreOrdersSkeleton — mirrors store/OrdersPage.tsx precisely.
 *
 * Layout:
 *  1. Dark green header (h1 title + subtitle)
 *  2. Content grid (xs:12 md:9 + xs:12 md:3):
 *     Left (md:9):
 *       – Filter/control bar (search + 3 select filters)
 *       – 4 order cards (ref, date, total | product thumbnails + status chip)
 *     Right (md:3):
 *       – Order Summary sidebar card
 */
export default function StoreOrdersSkeleton() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent' }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <Box
        sx={{
          bgcolor: 'primary.dark',
          pt: { xs: 4, md: 12 },
          pb: { xs: 4, md: 12 },
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(180deg, rgba(26,46,31,1) 0%, rgba(45,75,56,0.95) 100%)',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          {/* h1 */}
          <Skeleton
            variant="rounded"
            width={340}
            sx={{ height: { xs: 48, md: 72 }, mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}
            animation="wave"
          />
          {/* subtitle */}
          <Skeleton
            variant="rounded"
            width={260}
            height={20}
            sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}
            animation="wave"
          />
        </Box>
      </Box>

      {/* ── Content ─────────────────────────────────────────────── */}
      <Container
        maxWidth={false}
        sx={{ py: { xs: 2, md: 6 }, mt: { xs: -1.5, md: -4 }, position: 'relative', zIndex: 3, px: { xs: 1.5, md: 6 }, maxWidth: '1600px' }}
      >
        <Grid container spacing={{ xs: 2, md: 5 }}>

          {/* ── Main column (orders) ─────────────────────────── */}
          <Grid size={{ xs: 12, md: 9 }}>

            {/* Filter / control bar */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                mb: 2,
                p: { xs: 1, md: 1.5 },
                bgcolor: 'white',
                borderRadius: { xs: '16px', md: '24px' },
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
                alignItems: { xs: 'stretch', md: 'center' },
              }}
            >
              {/* Search */}
              <Skeleton variant="rounded" height={40} sx={{ flex: 1, borderRadius: '12px', minWidth: { md: 240 } }} animation="wave" />

              {/* Filter selects */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Skeleton variant="rounded" width={140} height={40} sx={{ borderRadius: '12px' }} animation="wave" />
                <Skeleton variant="rounded" width={160} height={40} sx={{ borderRadius: '12px' }} animation="wave" />
                <Skeleton variant="rounded" width={160} height={40} sx={{ borderRadius: '12px' }} animation="wave" />
              </Box>
            </Box>

            {/* Order cards */}
            <Stack spacing={{ xs: 2, md: 3 }}>
              {[...Array(4)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: { xs: '16px', md: '24px' },
                    bgcolor: 'white',
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 2.5 } }}>
                    {/* Top section: Reference / Date (left) + Total price (right) */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                      <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
                        {/* Reference */}
                        <Box>
                          <Skeleton variant="text" width={60} height={14} sx={{ mb: 0.5 }} animation="wave" />
                          <Skeleton variant="text" width={100} height={20} animation="wave" />
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ height: 24, display: { xs: 'none', sm: 'block' } }} />
                        {/* Date */}
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                          <Skeleton variant="text" width={40} height={14} sx={{ mb: 0.5 }} animation="wave" />
                          <Skeleton variant="text" width={110} height={20} animation="wave" />
                        </Box>
                      </Stack>

                      {/* Total price */}
                      <Box sx={{ textAlign: 'right' }}>
                        <Skeleton variant="text" width={70} height={14} sx={{ mb: 0.5, ml: 'auto' }} animation="wave" />
                        <Skeleton variant="text" width={90} height={40} sx={{ ml: 'auto' }} animation="wave" />
                      </Box>
                    </Box>

                    {/* Bottom section: product thumbnails (left) + status chip (right) */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, md: 1.5 }, flex: 1, minWidth: 200 }}>
                        {[...Array(3)].map((_, j) => (
                          <Skeleton
                            key={j}
                            variant="rounded"
                            sx={{
                              width: { xs: 44, md: 56 },
                              height: { xs: 54, md: 70 },
                              borderRadius: '12px',
                              bgcolor: 'rgba(0,0,0,0.04)',
                            }}
                            animation="wave"
                          />
                        ))}
                      </Box>
                      <Skeleton
                        variant="rounded"
                        sx={{ width: { xs: '100%', sm: 120 }, height: 32, borderRadius: '8px', bgcolor: 'rgba(0,0,0,0.04)' }}
                        animation="wave"
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* ── Sidebar (Order Summary) ──────────────────────── */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Card
              sx={{
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: 'none',
                overflow: 'hidden',
                bgcolor: 'white',
                position: { md: 'sticky' },
                top: 100,
              }}
            >
              {/* Card title */}
              <Box sx={{ p: 2.5, pb: 2 }}>
                <Skeleton variant="text" width="50%" height={26} animation="wave" />
              </Box>
              <Divider sx={{ borderColor: 'rgba(0,0,0,0.05)' }} />

              {/* Total Orders row */}
              <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton variant="text" width="45%" height={20} animation="wave" />
                <Skeleton variant="text" width="15%" height={24} animation="wave" />
              </Box>

              {/* Status rows */}
              {[...Array(5)].map((_, i) => (
                <Box key={i}>
                  <Divider sx={{ borderColor: 'rgba(0,0,0,0.05)' }} />
                  <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Skeleton variant="text" width={90} height={20} animation="wave" />
                    <Skeleton variant="text" width={20} height={24} animation="wave" />
                  </Box>
                </Box>
              ))}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
