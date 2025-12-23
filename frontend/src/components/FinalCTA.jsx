import { Box, Button, Typography } from '@mui/material';

export default function FinalCTA() {
  return (
    <Box
      sx={{
        py: 10,
        px: { xs: 2, md: 8 },
        background: 'radial-gradient(circle at center, #133c2b 0%, #062a19 100%)',
        textAlign: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: {xs: 350, sm: 600, md: 900, lg: 1000},
          height: 500,
          borderRadius: '50%',
          backgroundColor: 'rgba(241, 245, 248, 0.05)',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          width: {xs: 350, sm: 600, md: 900, lg: 1000},
          height: 500,
          borderRadius: '50%',
          backgroundColor: 'rgba(241, 245, 248, 0.05)',
          bottom: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 0,
        }}
      />

      {/* Contenido */}
      <Typography
        variant="h4"
        sx={{
          color: 'white',
          fontWeight: 700,
          fontSize: { xs: '1.8rem', md: '2.2rem' },
          mb: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        Te toca a <Box component="span" sx={{ color: '#b2f140', fontSize: { xs: '1.8rem', md: '2.2rem' } }}>VOS</Box> comenzar a{' '}
        <Box component="span" sx={{ color: '#b2f140', fontSize: { xs: '1.8rem', md: '2.2rem' } }}>OPTIMIZAR</Box> tu{' '}
        <Box component="span" sx={{ color: '#b2f140', fontSize: { xs: '1.8rem', md: '2.2rem' } }}>TIEMPO AHORA</Box>
      </Typography>

      <Button
        variant="contained"
        sx={{
          backgroundColor: '#b2f140',
          color: '#000',
          fontWeight: 600,
          borderRadius: 99,
          px: 4,
          py: 1.5,
          zIndex: 1,
          position: 'relative',
          '&:hover': {
            backgroundColor: '#b2f140',
          },
        }}
      >
        Listo para comenzar
      </Button>
    </Box>
  );
}
