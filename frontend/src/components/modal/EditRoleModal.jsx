import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';

const ROLES = [
  { value: 1, label: 'Profesional' },
  { value: 2, label: 'Cajero' },
  { value: 3, label: 'Socio' }
];

const EditRoleModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  currentRole = '', 
  loading = false, 
  isMobile = false 
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [role, setRole] = useState(currentRole);

  useEffect(() => {
    if (currentRole) setRole(currentRole);
  }, [currentRole]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(role);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="xs"
      fullScreen={fullScreen}
      sx={{
        '& .MuiDialog-paper': {
          margin: isMobile ? 0 : '32px',
          width: isMobile ? '100%' : 'calc(100% - 64px)',
          maxWidth: isMobile ? '100%' : '450px',
          height: isMobile ? '100%' : 'auto'
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: isMobile ? '1.25rem' : '1.5rem',
        px: isMobile ? 2 : 3,
        pt: isMobile ? 2 : 3
      }}>
        Editar rol del miembro
      </DialogTitle>
      
      <DialogContent sx={{ px: isMobile ? 2 : 3 }}>
        <DialogContentText sx={{ mb: 2 }}>
          Selecciona el nuevo rol para este miembro del personal.
        </DialogContentText>
        <TextField
          select
          label="Rol"
          fullWidth
          margin="normal"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={loading}
          size={isMobile ? 'small' : 'medium'}
        >
          {ROLES.map((option) => (
            <MenuItem 
              key={option.value} 
              value={option.value}
              sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
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
          onClick={handleSubmit}
          disabled={loading || role === currentRole}
          fullWidth={isMobile}
          size={isMobile ? 'medium' : 'large'}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRoleModal;