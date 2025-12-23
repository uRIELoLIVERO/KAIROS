import React from 'react';
import { Chip } from '@mui/material';

/**
 * Componente para mostrar el rol del usuario como un chip
 * @param {Object} props - Props del componente
 * @param {string} props.role - El rol a mostrar
 * @param {Object} props.sx - Estilos adicionales
 * @returns {JSX.Element} Chip con el rol
 */
const RoleChip = ({ role, sx = {} }) => (
  <Chip 
    size="small" 
    label={role} 
    sx={{ 
      fontWeight: 600,
      ...sx 
    }} 
  />
);

export default RoleChip;