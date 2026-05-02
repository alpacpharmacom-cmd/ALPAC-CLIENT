import { Box, Container, Typography, Stack, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { useRef } from 'react';

// Import images for Vite asset handling
import heroImg from '../../assets/images/about/hero_premium.png';
import processImg from '../../assets/images/about/process_detail.png';
import founderImg from '../../assets/images/about/founder_portrait.png';
import missionImg from '../../assets/images/about/mission.png';

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
      {/* Hero Section - Immersive Parallax */}
      <Box
        sx={{
          height: '100vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          overflow: 'hidden'
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
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.7) 100%)',
            },
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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
                letterSpacing: '0.4em'
              }}
            >
              ESTABLISHED 2024
            </MotionTypography>
            <MotionTypography
              variants={itemVariants}
              variant="h1"
              sx={{
                fontSize: { xs: '3.5rem', md: '6rem', lg: '7.5rem' },
                mb: 4,
                fontWeight: 600,
                lineHeight: 1,
                textShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}
            >
              The Science of <br />
              <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 300, color: 'secondary.light' }}>Pure Nature.</Box>
            </MotionTypography>
            
            <MotionBox
              variants={itemVariants}
              sx={{
                maxWidth: 700,
                mx: 'auto',
                p: { xs: 3, md: 4 },
                backdropFilter: 'blur(20px)',
                bgcolor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { md: '1.25rem' },
                  lineHeight: 1.8,
                  fontWeight: 300
                }}
              >
                At Alpac, we harmonize high-molecular biology with the untamed potency of rare botanicals. Experience a transformation that is as deliberate as it is natural.
              </Typography>
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>

      {/* Philosophy Section - Asymmetric Editorial */}
      <Box sx={{ py: { xs: 12, md: 25 }, bgcolor: 'transparent', position: 'relative' }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 8, md: 15 }} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <MotionBox
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                sx={{ position: 'relative' }}
              >
                {/* Decorative Elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -40,
                    left: -40,
                    width: 150,
                    height: 150,
                    borderLeft: '2px solid',
                    borderTop: '2px solid',
                    borderColor: 'secondary.light',
                    opacity: 0.5,
                    zIndex: 0,
                  }}
                />
                
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    overflow: 'hidden',
                    borderRadius: '2px', // Sharp, high-end look
                    boxShadow: '0 50px 100px rgba(0,0,0,0.1)'
                  }}
                >
                  <Box
                    component="img"
                    src={missionImg}
                    alt="Our Philosophy"
                    sx={{
                      width: '100%',
                      height: { xs: 500, md: 750 },
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 2s ease',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                  />
                </Box>
                
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -30,
                    right: -30,
                    width: '60%',
                    height: 200,
                    bgcolor: 'primary.main',
                    zIndex: -1,
                    display: { xs: 'none', md: 'block' }
                  }}
                />
              </MotionBox>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <MotionBox
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <Typography variant="overline" color="secondary.main" sx={{ fontWeight: 800, mb: 3, display: 'block', letterSpacing: '0.2em' }}>
                  OUR PHILOSOPHY
                </Typography>
                <Typography variant="h2" sx={{ mb: 5, color: 'primary.dark', position: 'relative' }}>
                  Beyond the <br />
                  <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 300 }}>Surface Layer</Box>
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', fontSize: '1.2rem', fontWeight: 300 }}>
                  We don't believe in quick fixes. We believe in cellular resonance. By utilizing bio-identical lipid structures, we ensure our botanical extracts penetrate deep into the epidermis where they can truly effect change.
                </Typography>
                <Typography variant="body1" sx={{ mb: 6, color: 'text.secondary', fontSize: '1.2rem', fontWeight: 300 }}>
                  Every formula is a masterpiece of balance—maximizing potency while minimizing irritation. This is the new standard of conscious luxury.
                </Typography>
                
                <Stack spacing={4}>
                  {[
                    { label: 'Bio-Identical Formulas', value: '100%' },
                    { label: 'Ethically Sourced Botanicals', value: 'Certified' },
                  ].map((stat, i) => (
                    <Box key={i}>
                      <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        sx={{ 
                          justifyContent: 'space-between', 
                          alignItems: { xs: 'flex-start', sm: 'flex-end' }, 
                          mb: 1,
                          gap: { xs: 0.5, sm: 0 }
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>{stat.label}</Typography>
                        <Typography variant="h5" color="secondary.main" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>{stat.value}</Typography>
                      </Stack>
                      <Box sx={{ width: '100%', height: '1px', bgcolor: 'divider' }}>
                        <MotionBox
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                          sx={{ height: '100%', bgcolor: 'secondary.main' }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Alchemical Process Section - Craftsmanship */}
      <Box sx={{ position: 'relative', py: 20, bgcolor: 'primary.dark', color: 'white' }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${processImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            filter: 'grayscale(100%) brightness(0.5)'
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={10} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <MotionBox
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Typography variant="overline" sx={{ color: 'secondary.main', mb: 2, display: 'block', fontWeight: 700 }}>
                  THE ALCHEMICAL PROCESS
                </Typography>
                <Typography variant="h2" sx={{ mb: 4, color: 'white' }}>
                  Nature Refined by <br />
                  <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 300 }}>Molecular Precision</Box>
                </Typography>
                <Grid container spacing={4} sx={{ mt: 6 }}>
                  {[
                    { title: 'Cold-Press Extraction', desc: 'Preserving the vital enzyme activity of our botanicals through low-temperature processing.' },
                    { title: 'Nano-Liposomal Delivery', desc: 'Encapsulating active ingredients for targeted, sustained release throughout the day.' },
                    { title: 'Clinical Validation', desc: 'Every product undergoes rigorous double-blind testing to ensure measurable results.' },
                  ].map((step, i) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={i}>
                      <Box sx={{ p: 3, border: '1px solid rgba(255,255,255,0.1)', height: '100%', bgcolor: 'rgba(255,255,255,0.02)' }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'secondary.light' }}>{step.title}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.6 }}>{step.desc}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </MotionBox>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
               <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                sx={{
                  position: 'relative',
                  p: 4,
                  border: '1px solid',
                  borderColor: 'secondary.main',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h3" sx={{ mb: 3, fontWeight: 300, fontStyle: 'italic' }}>
                  "Precision is the <br /> bridge between <br /> nature and art."
                </Typography>
                <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: '0.2em' }}>
                  Master Chemist, Alpac
                </Typography>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Founders Section - Leadership */}
      <Box sx={{ py: 25, bgcolor: '#FDFCFB' }}>
        <Container maxWidth="lg">
          <Grid container spacing={10} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <MotionBox
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Box
                  component="img"
                  src={founderImg}
                  alt="Founder"
                  sx={{
                    width: '100%',
                    height: 650,
                    objectFit: 'cover',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.1)'
                  }}
                />
              </MotionBox>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <MotionBox
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Typography variant="overline" color="secondary.main" sx={{ fontWeight: 800, mb: 2, display: 'block' }}>
                  THE LEADERSHIP
                </Typography>
                <Typography variant="h2" sx={{ mb: 4, color: 'primary.dark' }}>
                  A Vision for <br /> Conscious Beauty
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', fontSize: '1.25rem', lineHeight: 1.9, fontWeight: 300 }}>
                  Founded by Dr. Elena Vance, Alpac was born from a decade of research into botanical senescence and cellular rejuvenation. Her mission was clear: create a skincare line that doesn't just protect the skin, but actively enhances its innate biological functions.
                </Typography>
                <Typography variant="body1" sx={{ mb: 6, color: 'text.secondary', fontSize: '1.1rem', fontStyle: 'italic' }}>
                  "We don't inherit the earth from our ancestors; we borrow it from our children. Our commitment to sustainability is woven into every molecule of our products."
                </Typography>
                <Divider sx={{ mb: 4 }} />
                <Typography variant="h6" sx={{ color: 'primary.main', mb: 0.5 }}>Dr. Elena Vance</Typography>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary' }}>CEO & Head of Research</Typography>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Values Section - High-End Minimalist Cards */}
      <Box sx={{ py: 20, bgcolor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 12 }}>
            <Typography variant="overline" sx={{ color: 'secondary.main', mb: 2, display: 'block', fontWeight: 800 }}>
              OUR FOUNDATION
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 500, color: 'white' }}>
              Core Principles
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {[
              { title: 'Radical Transparency', desc: 'No hidden ingredients. No marketing fluff. Just pure, verified results and honest communication.' },
              { title: 'Circular Ethos', desc: 'Our packaging is 100% recyclable glass and FSC-certified paper, minimizing our footprint at every stage.' },
              { title: 'Scientific Honesty', desc: 'We only claim what we can prove. Our efficacy is backed by rigorous clinical data and peer-reviewed science.' },
            ].map((value, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <MotionBox
                  whileHover={{ y: -15 }}
                  sx={{
                    p: 6,
                    height: '100%',
                    bgcolor: 'primary.dark',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.4s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                      '& .value-num': { opacity: 0.1, transform: 'scale(1.2)' }
                    }
                  }}
                >
                  <Typography
                    className="value-num"
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: -10,
                      fontSize: '8rem',
                      fontWeight: 900,
                      color: 'white',
                      opacity: 0.03,
                      transition: 'all 0.6s ease',
                      pointerEvents: 'none'
                    }}
                  >
                    0{i + 1}
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 3, color: 'secondary.light' }}>{value.title}</Typography>
                  <Typography variant="body1" sx={{ opacity: 0.7, fontWeight: 300, lineHeight: 1.8 }}>{value.desc}</Typography>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
