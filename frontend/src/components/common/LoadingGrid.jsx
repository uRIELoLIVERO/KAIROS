import React from 'react';
import { Grid, Skeleton } from '@mui/material';

/**
 * Componente para mostrar un grid de esqueletos de carga
 * @param {Object} props - Props del componente
 * @param {number} props.items - Número de elementos a mostrar (default: 6)
 * @param {number} props.height - Altura de cada skeleton (default: 140)
 * @param {Object} props.gridItemProps - Props adicionales para Grid item
 * @returns {JSX.Element} Grid con skeletons de carga
 */
const LoadingGrid = ({ 
  items = 6, 
  height = 140, 
  gridItemProps = { xs: 12, sm: 6, md: 4, lg: 3 } 
}) => (
  <Grid container spacing={2}>
    {Array.from({ length: items }).map((_, index) => (
      <Grid item key={index} {...gridItemProps}>
        <Skeleton variant="rounded" height={height} />
      </Grid>
    ))}
  </Grid>
);

export default LoadingGrid;