import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';

/**
 * Modal para crear o editar un servicio
 */
const ServiceModal = ({ open, onClose, onSubmit, initialData, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    suggestedPrice: '',
    suggestedDuration: ''
  });

  const [errors, setErrors] = useState({});

  // Cargar datos iniciales cuando el modal se abre o cambian los initialData
  useEffect(() => {
    if (open) {
      if (isEdit && initialData) {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          suggestedPrice: initialData.suggestedPrice || '',
          suggestedDuration: initialData.suggestedDuration || ''
        });
      } else {
        setFormData({
          name: '',
          description: '',
          suggestedPrice: '',
          suggestedDuration: ''
        });
      }
      setErrors({});
    }
  }, [open, initialData, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.suggestedPrice || formData.suggestedPrice <= 0) 
      newErrors.suggestedPrice = 'El precio debe ser mayor a 0';
    if (!formData.suggestedDuration || formData.suggestedDuration <= 0) 
      newErrors.suggestedDuration = 'La duración debe ser mayor a 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        suggestedPrice: parseFloat(formData.suggestedPrice),
        suggestedDuration: parseInt(formData.suggestedDuration)
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nombre del servicio"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />
          
          <TextField
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
          
          <TextField
            label="Precio sugerido"
            name="suggestedPrice"
            type="number"
            value={formData.suggestedPrice}
            onChange={handleChange}
            error={!!errors.suggestedPrice}
            helperText={errors.suggestedPrice}
            fullWidth
            required
            InputProps={{
              inputProps: { min: 0, step: 0.01 }
            }}
          />
          
          <TextField
            label="Duración sugerida (minutos)"
            name="suggestedDuration"
            type="number"
            value={formData.suggestedDuration}
            onChange={handleChange}
            error={!!errors.suggestedDuration}
            helperText={errors.suggestedDuration}
            fullWidth
            required
            InputProps={{
              inputProps: { min: 1 }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEdit ? 'Guardar Cambios' : 'Crear Servicio'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceModal