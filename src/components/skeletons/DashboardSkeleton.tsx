import { Box, Grid, Skeleton, Card, CardContent } from '@mui/material';

/**
 * Dashboard Skeleton — precisely mirrors DashboardPage.tsx
 *
 * Layout:
 *  1. Header: title (left) + time/date (right)
 *  2. Alert row (2 alert cards)
 *  3. Stats row (4 stat cards with icon top-left, big number, label)
 *  4. Chart row: area chart (lg:8) + bar chart (lg:4)
 *  5. Bottom row: recent orders table (lg:8) + top sellers list (lg:4)
 */
export default function DashboardSkeleton() {
  return (
    <Box>
      {/* ── 1. Header ─────────────────────────────────────────────── */}
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Skeleton variant="text" width={280} height={56} sx={{ mb: 0.5, bgcolor: 'rgba(0,0,0,0.04)', borderRadius: '8px' }} animation="wave" />
          <Skeleton variant="text" width={220} height={24} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }} animation="wave" />
        </Box>
        {/* Time / date (hidden xs) */}
        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
          <Skeleton variant="text" width={90} height={34} sx={{ mb: 0.25, ml: 'auto', bgcolor: 'rgba(0,0,0,0.03)' }} animation="wave" />
          <Skeleton variant="text" width={160} height={16} sx={{ ml: 'auto', bgcolor: 'rgba(0,0,0,0.02)' }} animation="wave" />
        </Box>
      </Box>

      {/* ── 2. Alert Row ──────────────────────────────────────────── */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {[1, 2].map((i) => (
          <Grid size={{ xs: 12, md: 6 }} key={i}>
            <Box sx={{
              bgcolor: 'white',
              border: '1px solid rgba(0,0,0,0.05)',
              borderLeft: '6px solid rgba(0,0,0,0.06)',
              borderRadius: '24px',
              p: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                <Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: '14px', bgcolor: 'rgba(0,0,0,0.04)', flexShrink: 0 }} animation="wave" />
                <Box>
                  <Skeleton variant="text" width={140} height={26} sx={{ mb: 0.5, bgcolor: 'rgba(0,0,0,0.04)' }} animation="wave" />
                  <Skeleton variant="text" width={200} height={18} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }} animation="wave" />
                </Box>
              </Box>
              <Skeleton variant="rounded" width={96} height={40} sx={{ borderRadius: '12px', flexShrink: 0, bgcolor: 'rgba(0,0,0,0.04)' }} animation="wave" />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* ── 3. Stat Cards ─────────────────────────────────────────── */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid size={{ xs: 6, md: 3 }} key={i}>
            <Card sx={{ borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'none', bgcolor: 'white' }}>
              <CardContent sx={{ p: 3.5 }}>
                {/* Icon box top-right (icon is inside a row with justify: space-between) */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: '16px', bgcolor: 'rgba(0,0,0,0.04)' }} animation="wave" />
                </Box>
                <Skeleton variant="text" width="65%" height={52} sx={{ mb: 0.25, bgcolor: 'rgba(0,0,0,0.04)' }} animation="wave" />
                <Skeleton variant="text" width="45%" height={20} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }} animation="wave" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── 4. Charts ─────────────────────────────────────────────── */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* Area chart – lg:8 */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ bgcolor: 'white', borderRadius: '24px', p: 4, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 25px rgba(0,0,0,0.03)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Skeleton variant="text" width={160} height={30} sx={{ mb: 0.5, bgcolor: 'rgba(0,0,0,0.04)' }} animation="wave" />
                <Skeleton variant="text" width={200} height={16} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }} animation="wave" />
              </Box>
              <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: '12px', bgcolor: 'rgba(0,0,0,0.03)' }} animation="wave" />
            </Box>
            <Skeleton variant="rounded" sx={{ flex: 1, width: '100%', minHeight: 320, borderRadius: '16px', bgcolor: 'rgba(0,0,0,0.02)' }} animation="wave" />
          </Box>
        </Grid>

        {/* Bar chart – lg:4 */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ bgcolor: 'white', borderRadius: '24px', p: 4, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 25px rgba(0,0,0,0.03)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Skeleton variant="text" width={130} height={30} sx={{ mb: 0.5, bgcolor: 'rgba(0,0,0,0.04)' }} animation="wave" />
                <Skeleton variant="text" width={160} height={16} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }} animation="wave" />
              </Box>
              <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: '12px', bgcolor: 'rgba(0,0,0,0.03)' }} animation="wave" />
            </Box>
            <Skeleton variant="rounded" sx={{ flex: 1, width: '100%', minHeight: 320, borderRadius: '16px', bgcolor: 'rgba(0,0,0,0.02)' }} animation="wave" />
          </Box>
        </Grid>
      </Grid>

      {/* ── 5. Bottom Row ─────────────────────────────────────────── */}
      <Grid container spacing={4}>
        {/* Recent Orders – lg:8 */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ bgcolor: 'white', borderRadius: '24px', p: 4, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 25px rgba(0,0,0,0.03)' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Skeleton variant="text" width={150} height={30} sx={{ mb: 0.5, bgcolor: 'rgba(0,0,0,0.04)' }} animation="wave" />
                <Skeleton variant="text" width={180} height={16} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }} animation="wave" />
              </Box>
              <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: '12px', bgcolor: 'rgba(0,0,0,0.03)' }} animation="wave" />
            </Box>
            {/* Table header row */}
            <Box sx={{ display: 'flex', px: 1, py: 1.5, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '12px', mb: 1 }}>
              {[1, 1.5, 1, 1].map((flex, i) => (
                <Box key={i} sx={{ flex, px: 1 }}>
                  <Skeleton variant="text" width="60%" height={16} sx={{ bgcolor: 'rgba(0,0,0,0.04)' }} animation="wave" />
                </Box>
              ))}
            </Box>
            {/* Order rows */}
            {[...Array(5)].map((_, i) => (
              <Box key={i} sx={{ display: 'flex', px: 1, py: 2, alignItems: 'center', borderRadius: '12px', mb: 0.5 }}>
                <Box sx={{ flex: 1, px: 1 }}>
                  <Skeleton variant="text" width="80%" height={20} sx={{ bgcolor: 'rgba(0,0,0,0.03)' }} animation="wave" />
                  <Skeleton variant="text" width="60%" height={14} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }} animation="wave" />
                </Box>
                <Box sx={{ flex: 1.5, px: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: 'rgba(0,0,0,0.03)', flexShrink: 0 }} animation="wave" />
                  <Skeleton variant="text" width="60%" height={20} sx={{ bgcolor: 'rgba(0,0,0,0.03)' }} animation="wave" />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <Skeleton variant="rounded" width={140} height={32} sx={{ borderRadius: '8px', bgcolor: 'rgba(0,0,0,0.03)' }} animation="wave" />
                </Box>
                <Box sx={{ flex: 1, px: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <Skeleton variant="text" width="60%" height={20} sx={{ bgcolor: 'rgba(0,0,0,0.03)' }} animation="wave" />
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Top Sellers – lg:4 */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ bgcolor: 'white', borderRadius: '24px', p: 4, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 25px rgba(0,0,0,0.03)', height: '100%' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Skeleton variant="text" width={110} height={30} sx={{ mb: 0.5, bgcolor: 'rgba(0,0,0,0.04)' }} animation="wave" />
                <Skeleton variant="text" width={160} height={16} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }} animation="wave" />
              </Box>
              <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: '12px', bgcolor: 'rgba(0,0,0,0.03)' }} animation="wave" />
            </Box>
            {/* Top-selling product rows */}
            {[...Array(5)].map((_, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: '24px', border: '1px solid rgba(0,0,0,0.04)', mb: 2 }}>
                <Skeleton variant="rounded" width={54} height={68} sx={{ borderRadius: '12px', bgcolor: 'rgba(0,0,0,0.04)', flexShrink: 0, mr: 2 }} animation="wave" />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5, bgcolor: 'rgba(0,0,0,0.04)' }} animation="wave" />
                  <Skeleton variant="text" width="50%" height={14} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }} animation="wave" />
                </Box>
                <Skeleton variant="text" width={44} height={20} sx={{ bgcolor: 'rgba(0,0,0,0.03)' }} animation="wave" />
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
