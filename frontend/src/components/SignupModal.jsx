import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
  FormControl,
} from '@mui/material';
import { Google } from '@mui/icons-material';
import { useNavigate, Link as RouterLink} from 'react-router-dom'
import axios from 'axios';


export default function SignupModal({ open, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleSubmit = (event) => {
      event.preventDefault();
  
      const data = new FormData(event.currentTarget);
      const email = data.get('email');
      const password = data.get('password');
      const firstName = data.get('firstName');
      const lastName = data.get('lastName');
      const phoneNumber = data.get('phoneNumber');
  
      if (!email || !/\S+@\S+\.\S+/.test(email) || !password || password.length < 6) {
        console.warn('Datos inválidos');
        return;
      }
  
      const userData = { firstName, lastName, email, phoneNumber, password };
  
      axios.post('http://localhost:3000/auth/register', userData)
        .then(() => {
          onClose();
          navigate('/login');
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
          width: isMobile ? '90%' : 450,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          outline: 'none',
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" mb={1}>
          Registrarme Ahora
        </Typography>

        <Typography variant="body2" align="center" mb={3}>
          ¿Ya tienes una cuenta?{' '}
          <Button
            variant="text"
            size="small"
            sx={{ textTransform: 'none', p: 0 }}
          >
            <RouterLink to="/login" style={{ textDecoration: 'none', color: '#0e3d25' }}>
              Iniciar Sesión
            </RouterLink>
          </Button>
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <FormControl>
            <TextField
              label="Tu Nombre"
              variant="outlined"
              name="firstName"
              id='firstName'
              placeholder='Tu Nombre'
              required
              fullWidth
              margin="normal"
              size="small"
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Tu Apellido"
              variant="outlined"
              name="lastName"
              id='lastName'
              placeholder='Tu Apellido'
              required
              fullWidth
              margin="normal"
              size="small"
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Tu Número de Teléfono"
              variant="outlined"
              name="phoneNumber"
              id='phoneNumber'
              placeholder='Tu número de teléfono sin "+"'
              required
              fullWidth
              margin="normal"
              size="small"
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Tu Email"
              variant="outlined"
              name="email"
              id='email'
              placeholder='TuCorreo@Electrónico.com'
              required
              fullWidth
              margin="normal"
              size="small"
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Tu Contraseña"
              type="password"
              variant="outlined"
              name="password"
              id='password'
              placeholder='••••••'
              required
              fullWidth
              margin="normal"
              size="small"
            />
          </FormControl>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#0e3d25',
              color: 'white',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#0c331f',
              },
            }}
          >
            Crear Cuenta
          </Button>
        </Box>


        <Divider sx={{ my: 3 }}>O crear cuenta usando:</Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Google />}
          sx={{
            textTransform: 'none',
            borderRadius: '10px',
          }}
          onClick={() => alert('Registro con Google')}
        >
          Continuar como Google
        </Button>
      </Box>
    </Modal>
  );
}
