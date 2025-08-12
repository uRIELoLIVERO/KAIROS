import { Box, Button, Typography } from '@mui/material'
import heroImage from '../assets/heroImage1.png';


export default function HeroSection() {
    const heroData =
        {
            img: heroImage,
            description:'KAIROS image hero.'
        }

  return (
    <Box
      sx={{
        py: 8,
        px: { xs: 2, md: 8 },
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: '100vh' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        bgcolor: '#002C15'
      }}
    >
      <Typography
        variant='h1'
        sx={{
          fontSize: { xs: 'typography.h6.fontSize', sm: 'typography.h3.fontSize', md: 'typography.h1.fontSize' },
          fontWeight: 700,
          mb: 2,
          color: 'white'
        }}
      >
        Pedi tu turno desde DONDE SEA
      </Typography>

      <Button
        variant='contained'
        sx={{
          mt: 1,
          backgroundColor: '#b2f140',
          color: '#002C15',
          px: 4,
          py: 1.5,
          fontWeight: 600,
          fontSize: "typography.subtitle2.fontSize",
          '&:hover': { backgroundColor: 'limegreen' }
        }}
      >
        Probar GRATIS
      </Button>

      <Typography
        variant='subtitle2'
        color="#b2f140"
        mt={1.5}
        sx={{
          fontSize: { xs: 'typography.md.fontSize', sm: "typography.subtitle2.fontSize" },
          fontWeight: 500
        }}
      >
        • Sin ingresar datos
      </Typography>

      <Box
        component='img'
        src={heroData.img}
        alt={heroData.description}
        sx={{
          width: { xs: '100%', sm: '80%', md: '60%' },
          maxWidth: 800,
          height: 'auto',
          mt: { xs: 2, md: 4 },
        }}
      />
    </Box>
  )
}
