import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';

const AddMemberModal = ({ open, onClose, onSubmit, loading = false, isMobile = false }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    setEmail('');
    setError('');
    onClose();
  };

  const handleSubmit = () => {
    if (!email.trim()) {
      setError('Por favor ingresa un email válido');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    onSubmit(email.trim());
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && email.trim()) {
      handleSubmit();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      fullScreen={fullScreen}
      sx={{
        '& .MuiDialog-paper': {
          margin: isMobile ? 0 : '32px',
          width: isMobile ? '100%' : 'calc(100% - 64px)',
          maxWidth: isMobile ? '100%' : '500px',
          height: isMobile ? '100%' : 'auto'
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: isMobile ? '1.25rem' : '1.5rem',
        px: isMobile ? 2 : 3,
        pt: isMobile ? 2 : 3
      }}>
        Invitar nuevo miembro
      </DialogTitle>
      
      <DialogContent sx={{ px: isMobile ? 2 : 3 }}>
        <DialogContentText sx={{ mb: 2 }}>
          Ingresa el email de la persona que deseas agregar a la empresa.
        </DialogContentText>
        <TextField
          autoFocus
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          onKeyPress={handleKeyPress}
          disabled={loading}
          error={!!error}
          helperText={error}
          size={isMobile ? 'small' : 'medium'}
        />
      </DialogContent>
      
      <DialogActions sx={{
        px: isMobile ? 2 : 3,
        pb: isMobile ? 2 : 3,
        flexDirection: isMobile ? 'column-reverse' : 'row',
        gap: isMobile ? 1 : 0
      }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          fullWidth={isMobile}
          size={isMobile ? 'medium' : 'large'}
        >
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          disabled={!email.trim() || loading} 
          onClick={handleSubmit}
          fullWidth={isMobile}
          size={isMobile ? 'medium' : 'large'}
        >
          {loading ? 'Enviando...' : 'Invitar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberModal;