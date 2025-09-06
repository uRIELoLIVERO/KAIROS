import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

/**
 * Diálogo para crear una nueva empresa
 * @param {Object} props - Props del componente
 * @param {boolean} props.open - Si el diálogo está abierto
 * @param {Function} props.onClose - Función para cerrar el diálogo
 * @param {Function} props.onSubmit - Función para enviar el formulario
 * @param {boolean} props.loading - Si se está procesando la creación
 * @returns {JSX.Element} Diálogo de creación de empresa
 */
const CreateCompanyDialog = ({ open, onClose, onSubmit, loading = false }) => {
  const [name, setName] = useState('');

  const handleClose = () => {
    setName('');
    onClose();
  };

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && name.trim()) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear empresa</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Nombre"
          fullWidth
          margin="dense"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          disabled={!name.trim() || loading} 
          onClick={handleSubmit}
        >
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCompanyDialog;