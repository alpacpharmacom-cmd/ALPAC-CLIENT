import { Box, Skeleton, Card, CardContent } from '@mui/material';

/**
 * CardSkeleton — precisely mirrors ProductCard.tsx structure.
 *
 * Card layout (top→bottom):
 *   1. Image area  (aspectRatio: 0.85, rounded, mx: 1-2, mb: 1-1.5)
 *   2. CardContent (px: 1-2)
 *      a. Category label (small overline text)
 *      b. Product name  (2-line height)
 *      c. Rating stars + review count
 *      d. Price (+ optional strikethrough oldPrice)
 *   3. "Add to Cart" button flush to card bottom
 *      (no top border-radius, only bottom border-radius matching card)
 */
export default function CardSkeleton() {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f5f3ec',
        borderRadius: { xs: '20px', sm: '24px' },
        px: 0,
        pt: { xs: 1, sm: 2 },
        pb: 0,
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        minHeight: { xs: '320px', sm: '420px' },
      }}
    >
      {/* ── 1. Image area ── */}
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '0.85',
          borderRadius: { xs: '16px', sm: '20px' },
          overflow: 'hidden',
          mb: { xs: 1, sm: 1.5 },
          mx: { xs: 1, sm: 2 },
          bgcolor: 'rgba(0,0,0,0.05)',
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.06)',
            transform: 'none',
          }}
        />
      </Box>

      {/* ── 2. CardContent ── */}
      <CardContent
        sx={{
          p: 0,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 1, sm: 2 },
        }}
      >
        {/* a. Category label (overline) */}
        <Skeleton
          variant="text"
          width="40%"
          height={14}
          sx={{ mb: 0.5, bgcolor: 'rgba(0,0,0,0.04)' }}
          animation="wave"
        />

        {/* b. Product name — 2-line height */}
        <Skeleton
          variant="rounded"
          width="90%"
          sx={{ height: { xs: '1.92rem', sm: '2.5rem' }, mb: 1.5, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}
          animation="wave"
        />

        {/* c. Rating row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.4, sm: 0.8 }, mb: 0.5 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              variant="circular"
              sx={{ width: { xs: 11, sm: 14 }, height: { xs: 11, sm: 14 }, bgcolor: 'rgba(74, 103, 65, 0.1)' }}
              animation="wave"
            />
          ))}
          <Skeleton
            variant="text"
            width={24}
            height={14}
            sx={{ bgcolor: 'rgba(0,0,0,0.04)', ml: 0.5 }}
            animation="wave"
          />
        </Box>

        {/* d. Price row */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 0 }}>
          <Skeleton
            variant="text"
            width="35%"
            sx={{ height: { xs: 22, sm: 28 }, bgcolor: 'rgba(45, 75, 56, 0.07)', borderRadius: '4px' }}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width="22%"
            sx={{ height: { xs: 16, sm: 20 }, bgcolor: 'rgba(0,0,0,0.04)', borderRadius: '4px' }}
            animation="wave"
          />
        </Box>
      </CardContent>

      {/* ── 3. "Add to Cart" button — flush bottom ── */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: '100%',
          height: { xs: 40, sm: 48 },
          mt: 'auto',
          bgcolor: 'rgba(45, 75, 56, 0.12)',
          borderRadius: 0,
          borderBottomLeftRadius: { xs: '16px', sm: '20px' },
          borderBottomRightRadius: { xs: '16px', sm: '20px' },
          transform: 'none',
        }}
      />
    </Card>
  );
}
