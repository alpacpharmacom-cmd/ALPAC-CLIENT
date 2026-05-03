import { Box, Container, Typography } from '@mui/material';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { useRef } from 'react';

// Import images for Vite asset handling
import heroImg from '../../assets/images/about/hero_premium.png';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

export default function AboutPage() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <Box ref={containerRef} sx={{ position: 'relative', bgcolor: 'transparent', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: '60vh', md: '80vh' },
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          overflow: 'hidden',
          bgcolor: 'primary.dark'
        }}
      >
        <MotionBox
          style={{ y: heroY }}
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${heroImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.7,
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
            },
          }}
        />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <MotionBox
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={{ opacity: heroOpacity }}
          >
            <MotionTypography
              variants={itemVariants}
              variant="overline"
              sx={{ 
                color: 'secondary.main', 
                mb: 2, 
                display: 'block', 
                fontWeight: 700,
                letterSpacing: '0.2em'
              }}
            >
              WELCOME TO ALPAC
            </MotionTypography>
            <MotionTypography
              variants={itemVariants}
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', md: '5rem' },
                mb: 3,
                fontWeight: 600,
                lineHeight: 1.1,
                textShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}
            >
              Your Health,<br />
              <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 300, color: 'secondary.light' }}>Our Mission.</Box>
            </MotionTypography>
            
            <MotionTypography
              variants={itemVariants}
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { md: '1.25rem' },
                lineHeight: 1.8,
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              At Alpac, we harmonize high-molecular biology with the untamed potency of rare botanicals. Experience a transformation that is as deliberate as it is natural.
            </MotionTypography>
          </MotionBox>
        </Container>
      </Box>

      {/* Company Story Section */}
      <Box sx={{ py: { xs: 10, md: 15 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 8, md: 12 } }}>
            {/* Row 1: Overview & Mission */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 8, md: 12 } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="overline" sx={{ color: 'secondary.main', mb: 2, display: 'block', fontWeight: 800 }}>
                  COMPANY OVERVIEW
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 500, color: 'primary.dark', mb: 3 }}>
                  Redefining Wellness
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
                  ALPAC is a pioneer in advanced botanical care, pursuing an ambitious strategy to redefine wellness through a robust, futuristic platform that merges nature's purity with uncompromising quality. We are moving thoughtfully to establish our presence in the conscious beauty market, driven by a sound strategy to bring premium, holistic care to our community.
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="overline" sx={{ color: 'secondary.main', mb: 2, display: 'block', fontWeight: 800 }}>
                  OUR MISSION
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 500, color: 'primary.dark', mb: 3 }}>
                  Care, Not Just Medicine
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
                  Our mission is to nurture the well-being of our community by developing innovative botanical formulas that address holistic skin health. We are dedicated to supplying highly effective, premium care that enhances your natural beauty and vitality, focusing on wellness rather than simply treating illness.
                </Typography>
              </Box>
            </Box>

            {/* Row 2: Foundation & Vision */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 8, md: 12 } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="overline" sx={{ color: 'secondary.main', mb: 2, display: 'block', fontWeight: 800 }}>
                  OUR FOUNDATION
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 500, color: 'primary.dark', mb: 3 }}>
                  Rooted in Science
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
                  Founded in 2019 in Egypt by a collective of scientific and botanical experts, ALPAC was born from a desire to elevate personal care. We specialize in crafting premium skincare and wellness products of the highest quality, shifting the paradigm from clinical medicine to holistic, preventative care.
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="overline" sx={{ color: 'secondary.main', mb: 2, display: 'block', fontWeight: 800 }}>
                  OUR VISION
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 500, color: 'primary.dark', mb: 3 }}>
                  The Future of Botanical Care
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
                  The individual is at the center of everything we do. Our values drive us to execute the ALPAC strategy in line with our vision of being at the forefront of the premium botanical care industry, providing a diverse portfolio of high-quality, transformative wellness products.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
