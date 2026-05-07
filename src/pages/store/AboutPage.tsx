import { Box, Container, Typography, Grid, Divider } from '@mui/material';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { useRef } from 'react';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ScienceIcon from '@mui/icons-material/Science';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PublicIcon from '@mui/icons-material/Public';

// Import images for Vite asset handling
import heroImg from '../../assets/images/about/hero_natural.png';
import missionImg from '../../assets/images/about/mission_natural_v2.png';
import founderImg from '../../assets/images/about/foundation_natural_v3.png';
import processImg from '../../assets/images/about/process_natural_v3.png';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    }
  }
};

export default function AboutPage() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <Box ref={containerRef} sx={{ bgcolor: 'var(--ivory)', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: '60vh', md: '75vh' },
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          overflow: 'hidden',
          bgcolor: 'var(--sage-dark)'
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
            opacity: 0.8,
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)',
            },
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <MotionBox
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            style={{ opacity: heroOpacity }}
          >
            <MotionTypography
              variants={fadeInVariants}
              variant="overline"
              sx={{ 
                color: 'var(--gold-light)', 
                mb: 2, 
                display: 'block', 
                fontWeight: 700,
                letterSpacing: '0.4em',
                textTransform: 'uppercase'
              }}
            >
              The Alpac Legacy
            </MotionTypography>
            <MotionTypography
              variants={fadeInVariants}
              variant="h1"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: '3rem', md: '6rem' },
                mb: 4,
                fontWeight: 500,
                lineHeight: 1,
                textShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              Your Health,<br />
              <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--gold-light)' }}>Our Mission.</Box>
            </MotionTypography>
            
            <MotionTypography
              variants={fadeInVariants}
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '1rem', md: '1.4rem' },
                lineHeight: 1.6,
                fontWeight: 300,
                maxWidth: 700,
                mx: 'auto',
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              A convergence of molecular science and botanical wisdom. We create more than products; we craft transformations for the conscious individual.
            </MotionTypography>
          </MotionBox>
        </Container>

        <MotionBox 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          sx={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', opacity: 0.6 }}
        >
          <Box sx={{ width: 1, height: 60, borderRight: '1px solid white', mx: 'auto' }} />
        </MotionBox>
      </Box>

      {/* Manifesto Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, textAlign: 'center', bgcolor: 'white' }}>
        <Container maxWidth="md">
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInVariants}
          >
            <Typography variant="overline" sx={{ color: 'var(--gold)', fontWeight: 800, mb: 3, display: 'block', letterSpacing: '0.2em' }}>
              OUR MANIFESTO
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                fontFamily: "'Playfair Display', serif", 
                color: 'var(--sage-dark)', 
                fontSize: { xs: '2rem', md: '3.5rem' },
                lineHeight: 1.2,
                mb: 4
              }}
            >
              "We believe that true beauty is the outward expression of inner vitality and scientific precision."
            </Typography>
            <Divider sx={{ width: 80, mx: 'auto', bgcolor: 'var(--gold)', height: 2, mb: 4 }} />
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.2rem', maxWidth: 600, mx: 'auto' }}>
              Since our inception in 2019, we have dedicated ourselves to bridging the gap between clinical efficacy and botanical purity.
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      {/* Values Grid */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {[
              { icon: <LocalFloristIcon />, title: 'Pure Botanicals', desc: 'Rare ingredients sourced from the most pristine environments across Egypt.' },
              { icon: <ScienceIcon />, title: 'Molecular Science', desc: 'Advanced formulas that ensure every drop delivers maximum cellular impact.' },
              { icon: <VerifiedUserIcon />, title: 'Ethical Quality', desc: 'Uncompromising standards of purity, transparency, and clinical excellence.' },
              { icon: <PublicIcon />, title: 'Conscious Impact', desc: 'Deeply committed to sustainability and the well-being of our global community.' }
            ].map((value, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <MotionBox
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInVariants}
                  transition={{ delay: idx * 0.1 }}
                  sx={{ 
                    textAlign: 'center',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateY(-10px)' }
                  }}
                >
                  <Box sx={{ color: 'var(--gold)', mb: 3, display: 'flex', justifyContent: 'center', '& .MuiSvgIcon-root': { fontSize: 40 } }}>
                    {value.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", mb: 2, color: 'var(--sage-dark)', fontWeight: 600 }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, px: 2 }}>
                    {value.desc}
                  </Typography>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Split Section: Mission */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={10} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInVariants}
              >
                <Typography variant="overline" sx={{ color: 'var(--gold)', fontWeight: 800, mb: 2, display: 'block', letterSpacing: '0.2em' }}>
                  OUR MISSION
                </Typography>
                <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", color: 'var(--sage-dark)', mb: 4, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                  Care, Not Just Medicine
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', mb: 4, lineHeight: 1.8 }}>
                  Our mission is to nurture the well-being of our community by developing innovative botanical formulas that address holistic skin health. We are dedicated to supplying highly effective, premium care that enhances your natural beauty and vitality.
                </Typography>
                <Box sx={{ display: 'flex', gap: 4 }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: 'var(--gold)', fontWeight: 600 }}>100%</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>ORGANIC SOURCES</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: 'var(--gold)', fontWeight: 600 }}>2019</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>ESTABLISHED</Typography>
                  </Box>
                </Box>
              </MotionBox>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                sx={{ 
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 20,
                    right: -20,
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                    borderRadius: 2
                  }
                }}
              >
                <Box 
                  component="img" 
                  src={missionImg} 
                  alt="Mission" 
                  sx={{ width: 1, height: 500, objectFit: 'cover', borderRadius: '20px', boxShadow: 10 }}
                />
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Founder Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'var(--sage-dark)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative Watermark */}
        <Typography 
          sx={{ 
            position: 'absolute', 
            top: -20, 
            left: -20, 
            fontSize: '15rem', 
            fontWeight: 900, 
            color: 'rgba(255,255,255,0.03)', 
            zIndex: 0,
            userSelect: 'none'
          }}
        >
          2019
        </Typography>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid 
            container 
            spacing={10} 
            sx={{ 
              alignItems: 'center',
              flexDirection: { xs: 'column-reverse', md: 'row' }
            }}
          >
            <Grid size={{ xs: 12, md: 5 }}>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                sx={{ position: 'relative' }}
              >
                <Box 
                  component="img" 
                  src={founderImg} 
                  alt="Founder" 
                  sx={{ 
                    width: 1, 
                    height: { xs: 450, md: 650 }, 
                    objectFit: 'cover', 
                    borderRadius: '20px',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
                  }}
                />
              </MotionBox>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInVariants}
              >
                <Typography variant="overline" sx={{ color: 'var(--gold-light)', fontWeight: 800, mb: 2, display: 'block', letterSpacing: '0.2em' }}>
                  OUR FOUNDATION
                </Typography>
                <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", mb: 4, fontSize: { xs: '2.5rem', md: '4rem' } }}>
                  Rooted in Science & Passion<br />
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem', mb: 3, lineHeight: 1.8 }}>
                  Founded in 2019 in Egypt by a collective of scientific and botanical experts, ALPAC was born from a desire to elevate personal care. We specialize in crafting premium skincare and wellness products of the highest quality.
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem', mb: 5, lineHeight: 1.8 }}>
                  We shifted the paradigm from clinical medicine to holistic, preventative care, ensuring that every individual who uses Alpac feels the care and precision we put into every bottle.
                </Typography>
                
                <Box sx={{ position: 'relative', pl: 4 }}>
                  <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, bgcolor: 'var(--gold)', borderRadius: 2 }} />
                  <Typography variant="h5" sx={{ fontStyle: 'italic', fontWeight: 300, lineHeight: 1.6, color: 'var(--gold-light)' }}>
                    "Our goal was never to just sell products, but to create a new standard for botanical excellence in the Middle East."
                  </Typography>
                </Box>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Process Detail Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={10} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInVariants}
              >
                <Typography variant="overline" sx={{ color: 'var(--gold)', fontWeight: 800, mb: 2, display: 'block', letterSpacing: '0.2em' }}>
                  THE PROCESS
                </Typography>
                <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", color: 'var(--sage-dark)', mb: 4, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                  Uncompromising Standards
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', mb: 4, lineHeight: 1.8 }}>
                  We pursue an ambitious strategy to redefine wellness through a robust, futuristic platform that merges nature's purity with uncompromising quality. Every ingredient is tested for potency and purity before it enters our formulation stage.
                </Typography>
                <Box component="ul" sx={{ color: 'text.secondary', pl: 2, '& li': { mb: 2 } }}>
                  <li><Typography variant="body1">Sourcing only rare botanical species.</Typography></li>
                  <li><Typography variant="body1">Cold-press extraction to preserve vital nutrients.</Typography></li>
                  <li><Typography variant="body1">Rigorous clinical testing for all skin types.</Typography></li>
                </Box>
              </MotionBox>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                sx={{ 
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    left: -20,
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                    borderRadius: '0 50% 0 0'
                  }
                }}
              >
                <Box 
                  component="img" 
                  src={processImg} 
                  alt="Process" 
                  sx={{ width: 1, height: 500, objectFit: 'cover', borderRadius: '20px', boxShadow: 10 }}
                />
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Sustainability Section */}
      <Box sx={{ py: { xs: 8, md: 15 }, textAlign: 'center', bgcolor: 'white' }}>
        <Container maxWidth="md">
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInVariants}
          >
            <Typography variant="overline" sx={{ color: 'var(--gold)', fontWeight: 800, mb: 3, display: 'block', letterSpacing: '0.2em' }}>
              OUR FUTURE
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                fontFamily: "'Playfair Display', serif", 
                color: 'var(--sage-dark)', 
                fontSize: { xs: '2rem', md: '3.5rem' },
                lineHeight: 1.2,
                mb: 4
              }}
            >
              Sustainability & Vision<br />
            </Typography>
            <Divider sx={{ width: 80, mx: 'auto', bgcolor: 'var(--gold)', height: 2, mb: 4 }} />
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.2rem', maxWidth: 600, mx: 'auto', mb: 4 }}>
              The individual is at the center of everything we do. Our values drive us to be at the forefront of the premium botanical care industry, providing a diverse portfolio of high-quality, transformative wellness products while protecting the planet that provides our ingredients.
            </Typography>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
}
