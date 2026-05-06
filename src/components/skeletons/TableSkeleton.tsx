import { Box, Skeleton } from '@mui/material';

interface ColumnConfig {
  /** Label used only as semantic key */
  flex: number;
  align?: 'left' | 'center' | 'right';
  /** 'image' = small rect thumbnail; 'chip' = pill badge; 'text' = plain text; 'actions' = icon buttons */
  variant?: 'text' | 'image' | 'chip' | 'actions';
}

interface TableSkeletonProps {
  rows?: number;
  columns?: ColumnConfig[];
}

/**
 * TableSkeleton — mirrors the custom flex-row table used in
 * ProductsPage, OrdersPage and UsersPage.
 *
 * Each page passes its own `columns` config to match the real header exactly.
 * The skeleton renders ONE unified scrollable box with the header inside it,
 * matching how the actual pages render (header + rows all inside the same
 * overflow:auto / minWidth box).
 */
export default function TableSkeleton({
  rows = 7,
  columns = [
    { flex: 3, align: 'left',   variant: 'image'   },
    { flex: 1, align: 'center', variant: 'chip'    },
    { flex: 1, align: 'center', variant: 'text'    },
    { flex: 1.2, align: 'center', variant: 'chip'  },
    { flex: 0.8, align: 'center', variant: 'chip'  },
    { flex: 1, align: 'right',  variant: 'actions' },
  ],
}: TableSkeletonProps) {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'white',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ minWidth: 800 }}>
          {/* ── Header ── */}
          <Box
            sx={{
              display: 'flex',
              px: 3,
              py: 1.5,
              bgcolor: 'rgba(0,0,0,0.01)',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            {columns.map((col, idx) => (
              <Box
                key={`hdr-${idx}`}
                sx={{
                  flex: col.flex,
                  display: 'flex',
                  justifyContent:
                    col.align === 'right'
                      ? 'flex-end'
                      : col.align === 'center'
                      ? 'center'
                      : 'flex-start',
                }}
              >
                <Skeleton
                  variant="text"
                  width="55%"
                  height={16}
                  sx={{ bgcolor: 'rgba(0,0,0,0.04)' }}
                  animation="wave"
                />
              </Box>
            ))}
          </Box>

          {/* ── Rows ── */}
          {[...Array(rows)].map((_, rowIdx) => (
            <Box
              key={rowIdx}
              sx={{
                display: 'flex',
                px: 3,
                py: 1.5,
                alignItems: 'center',
                borderBottom: rowIdx < rows - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
              }}
            >
              {columns.map((col, colIdx) => (
                <Box
                  key={`cell-${colIdx}`}
                  sx={{
                    flex: col.flex,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                      col.align === 'right'
                        ? 'flex-end'
                        : col.align === 'center'
                        ? 'center'
                        : 'flex-start',
                    gap: 1.5,
                  }}
                >
                  {col.variant === 'image' ? (
                    /* Product / user image + text (left-aligned col) */
                    <>
                      <Skeleton
                        variant="rounded"
                        width={50}
                        height={64}
                        sx={{ borderRadius: '10px', bgcolor: 'rgba(0,0,0,0.04)', flexShrink: 0 }}
                        animation="wave"
                      />
                      <Box>
                        <Skeleton variant="text" width={120} height={20} sx={{ bgcolor: 'rgba(0,0,0,0.04)' }} animation="wave" />
                        <Skeleton variant="text" width={80} height={14} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }} animation="wave" />
                      </Box>
                    </>
                  ) : col.variant === 'chip' ? (
                    /* Coloured badge / status chip */
                    <Skeleton
                      variant="rounded"
                      width="75%"
                      height={32}
                      sx={{ borderRadius: '8px', bgcolor: 'rgba(0,0,0,0.04)' }}
                      animation="wave"
                    />
                  ) : col.variant === 'actions' ? (
                    /* Icon-button group */
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Skeleton variant="rounded" width={30} height={30} sx={{ borderRadius: '8px', bgcolor: 'rgba(0,0,0,0.03)' }} animation="wave" />
                      <Skeleton variant="rounded" width={30} height={30} sx={{ borderRadius: '8px', bgcolor: 'rgba(0,0,0,0.03)' }} animation="wave" />
                    </Box>
                  ) : (
                    /* Plain text */
                    <Skeleton
                      variant="text"
                      width="70%"
                      height={20}
                      sx={{ bgcolor: 'rgba(0,0,0,0.03)' }}
                      animation="wave"
                    />
                  )}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
