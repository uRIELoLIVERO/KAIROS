import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography
} from '@mui/material';

/**
 * Modal para prestar un servicio (crear offeredService)
 */
const ProvideServiceModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  service, 
  staffMembers 
}) => {
  const [formData, setFormData] = useState({
    staffMemberId: '',
    customPrice: '',
    customDuration: '',
    customDescription: ''
  });

  const [errors, setErrors] = useState({});

  // Cargar datos iniciales cuando el modal se abre
  useEffect(() => {
    if (open && service) {
      setFormData({
        staffMemberId: '',
        customPrice: service.suggestedPrice || '',
        customDuration: service.suggestedDuration || '',
        customDescription: service.description || ''
      });
      setErrors({});
    }
  }, [open, service]);

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
    
    if (!formData.staffMemberId) newErrors.staffMemberId = 'Seleccione un miembro del staff';
    if (!formData.customPrice || formData.customPrice <= 0) 
      newErrors.customPrice = 'El precio debe ser mayor a 0';
    if (!formData.customDuration || formData.customDuration <= 0) 
      newErrors.customDuration = 'La duración debe ser mayor a 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const submittedData = {
        staffMemberId: formData.staffMemberId,
        serviceId: service.id,
        customPrice: formData.customPrice ? parseFloat(formData.customPrice) : undefined,
        customDuration: formData.customDuration ? parseInt(formData.customDuration) : undefined,
        customDescription: formData.customDescription || undefined
      };
      
      // Eliminar propiedades undefined
      Object.keys(submittedData).forEach(key => {
        if (submittedData[key] === undefined) {
          delete submittedData[key];
        }
      });
      
      onSubmit(submittedData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Prestar Servicio: {service?.name}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            select
            label="Miembro del Staff"
            name="staffMemberId"
            value={formData.staffMemberId}
            onChange={handleChange}
            error={!!errors.staffMemberId}
            helperText={errors.staffMemberId}
            fullWidth
            required
          >
            <MenuItem value="">
              <em>Seleccionar</em>
            </MenuItem>
            {staffMembers.map((staff) => (
              <MenuItem key={staff.staffMemberId} value={staff.staffMemberId}>
                {staff.user.firstName} {staff.user.lastName}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            label="Precio personalizado"
            name="customPrice"
            type="number"
            value={formData.customPrice}
            onChange={handleChange}
            error={!!errors.customPrice}
            helperText={errors.customPrice || `Precio sugerido: ${service?.suggestedPrice}`}
            fullWidth
            InputProps={{
              inputProps: { min: 0, step: 0.01 }
            }}
          />
          
          <TextField
            label="Duración personalizada (minutos)"
            name="customDuration"
            type="number"
            value={formData.customDuration}
            onChange={handleChange}
            error={!!errors.customDuration}
            helperText={errors.customDuration || `Duración sugerida: ${service?.suggestedDuration} minutos`}
            fullWidth
            InputProps={{
              inputProps: { min: 1 }
            }}
          />
          
          <TextField
            label="Descripción personalizada"
            name="customDescription"
            value={formData.customDescription}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            helperText="Dejar vacío para usar la descripción original"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          Prestar Servicio
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProvideServiceModal