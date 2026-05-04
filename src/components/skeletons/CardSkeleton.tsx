import { Box, Skeleton, Card, CardContent } from '@mui/material';

interface CardSkeletonProps {
  hasAction?: boolean;
  hasRating?: boolean;
}

/**
 * Premium Generic Card Skeleton
 * Aligned with the ALPAC Eco-Luxury storefront grid
 */
export default function CardSkeleton({ 
  hasAction = true,
  hasRating = true
}: CardSkeletonProps) {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f5f3ec',
        borderRadius: { xs: '20px', sm: '24px' },
        px: { xs: 1, sm: 2 },
        pt: { xs: 1, sm: 2 },
        pb: { xs: 0.6, sm: 1 },
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Image area — mirrors ProductCard's aspectRatio: '0.85' container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: 'calc(100% / 0.85)', // enforces 0.85 aspect ratio
          borderRadius: { xs: '14px', sm: '18px' },
          overflow: 'hidden',
          mb: { xs: 1, sm: 1.5 },
          bgcolor: 'rgba(0,0,0,0.06)',
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.08)',
            transform: 'none',
          }}
        />
      </Box>
      <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Skeleton 
          variant="rectangular" 
          width="40%" 
          height={14} 
          sx={{ mb: 0.5, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: '4px' }} 
          animation="wave"
        />
        <Skeleton 
          variant="rectangular" 
          width="90%" 
          height={32} 
          sx={{ mb: 1.5, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: '4px' }} 
          animation="wave"
        />
        
        <Box sx={{ mt: 'auto', mb: 1.5 }}>
          {hasRating && (
            <Box sx={{ display: 'flex', gap: { xs: 0.4, sm: 0.8 }, mb: 0.5 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton 
                  key={i} 
                  variant="circular" 
                  width={14} 
                  height={14} 
                  sx={{ bgcolor: 'rgba(74, 103, 65, 0.08)' }} // Hint of botanical green
                  animation="wave"
                />
              ))}
            </Box>
          )}
          <Skeleton 
            variant="rectangular" 
            width="35%" 
            height={24} 
            sx={{ bgcolor: 'rgba(45, 75, 56, 0.05)', borderRadius: '6px' }} 
            animation="wave"
          />
        </Box>

        {hasAction && (
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            sx={{ 
              height: { xs: 32, sm: 38 },
              mt: 0.5,
              borderRadius: '10px', 
              bgcolor: 'rgba(45, 75, 56, 0.08)' 
            }} 
            animation="wave"
          />
        )}
      </CardContent>
    </Card>
  );
}
