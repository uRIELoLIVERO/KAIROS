import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  useMediaQuery,
  useTheme,
  FormControl,
  FormLabel
} from '@mui/material';
import { Google } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

export default function LoginModal({ open, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    if (!email || !/\S+@\S+\.\S+/.test(email) || !password || password.length < 6) {
      console.warn('Datos inválidos');
      return;
    }

    const userData = { email, password };

    axios.post('http://localhost:3000/auth/login', userData, {
      withCredentials: true
    })
      .then(() => {
        onClose();
        navigate('/app/calendar');
      })
      .catch(error => {
        console.error('Error al logearse:', error);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '90%' : 400,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          outline: 'none',
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" mb={1}>
          Iniciar Sesión
        </Typography>

        <Typography variant="body2" align="center" mb={3}>
          ¿No tienes una cuenta?{' '}
          <RouterLink to="/signup" style={{ textDecoration: 'none', color: '#0e3d25' }}>
            Crear Cuenta
          </RouterLink>
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <FormControl fullWidth margin="normal">
            <TextField
              id="email"
              name="email"
              label="Tu Email"
              variant="outlined"
              autoComplete="email"
              required
              fullWidth
              size="small"
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              id="password"
              name="password"
              label="Tu Contraseña"
              type="password"
              variant="outlined"
              required
              fullWidth
              size="small"
            />
          </FormControl>

          <FormControlLabel
            control={<Checkbox />}
            label="Mantenerme logeado"
            sx={{ mt: 1, mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#0e3d25',
              color: 'white',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 'bold',
              mb: 1,
              '&:hover': {
                backgroundColor: '#0c331f',
              },
            }}
          >
            Iniciar Sesión
          </Button>
        </Box>

        <Typography variant="body2" align="center" mb={2}>
          <Button
            variant="text"
            size="small"
            sx={{ textTransform: 'none', p: 0 }}
            onClick={() => alert('Recuperar contraseña')}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </Typography>

        <Divider>O ingresa utilizando:</Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Google />}
          sx={{
            mt: 2,
            textTransform: 'none',
            borderRadius: '10px',
          }}
          onClick={() => alert('Login con Google')}
        >
          Continuar con Google
        </Button>
      </Box>
    </Modal>
  );
}
