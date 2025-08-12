import { Box, Typography, IconButton } from '@mui/material';
import { Facebook, Twitter, Google } from '@mui/icons-material';
import logoKairos from '../assets/logoKairosApp.png';

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 4, px: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 2, md: 0 }
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src={logoKairos}
          alt="Logo Kairos"
          sx={{ width: 32, height: 'auto' }}
        />

        {/* Texto */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', flexGrow: 1 }}
        >
          © 2025 Uriel Olivero. All rights reserved.
        </Typography>

        {/* Redes */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton aria-label="Twitter" sx={{ color: '#002C15' }}>
            <Twitter />
          </IconButton>
          <IconButton aria-label="Facebook" sx={{ color: '#002C15' }}>
            <Facebook />
          </IconButton>
          <IconButton aria-label="Google" sx={{ color: '#002C15' }}>
            <Google />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
