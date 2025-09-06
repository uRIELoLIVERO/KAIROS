import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Avatar,
  Typography
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import RoleChip from '../common/RoleChip';

/**
 * Componente para mostrar una tarjeta de empresa
 * @param {Object} props - Props del componente
 * @param {string} props.name - Nombre de la empresa
 * @param {string} props.role - Rol del usuario en la empresa
 * @param {string} props.logoUrl - URL del logo de la empresa
 * @param {Function} props.onEnter - Función a ejecutar al hacer clic
 * @returns {JSX.Element} Tarjeta de empresa clickeable
 */
const CompanyCard = ({ name, role, logoUrl, onEnter }) => {
  const renderAvatar = () => {
    if (logoUrl) {
      return <Avatar src={logoUrl} alt={name} />;
    }
    return (
      <Avatar>
        <BusinessIcon />
      </Avatar>
    );
  };

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardActionArea onClick={onEnter} sx={{ height: '100%' }}>
        <CardHeader
          avatar={renderAvatar()}
          title={<Typography fontWeight={700}>{name}</Typography>}
          subheader={<RoleChip role={role} />}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Toca para gestionar lo que tu rol permite.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CompanyCard;