import React from 'react';
import { Paper, Typography } from '@mui/material';

/**
 * Componente para mostrar errores de forma consistente
 * @param {Object} props - Props del componente
 * @param {string} props.message - Mensaje de error a mostrar
 * @param {Object} props.sx - Estilos adicionales
 * @returns {JSX.Element} Paper con el mensaje de error
 */
const ErrorPaper = ({ message, sx = {} }) => (
  <Paper 
    sx={{ 
      p: 2, 
      mb: 2, 
      border: '1px solid', 
      borderColor: 'error.light',
      ...sx 
    }}
  >
    <Typography color="error">{message}</Typography>
  </Paper>
);

export default ErrorPaper;