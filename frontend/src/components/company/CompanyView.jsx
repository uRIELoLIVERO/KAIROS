import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Avatar,
  Typography,
  Button,
  Stack,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Skeleton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LockIcon from '@mui/icons-material/Lock';

import { useCompany } from '../../hooks/useCompany';
import { useAuth } from '../../hooks/useAuth';
import { useCompanyPermissions } from '../../hooks/useCompanyPermissions';
import { useUserStaffMembers } from '../../hooks/useUserStaffMembers';
import { TABS_BY_ROLE, ROLES } from '../../constants/roles';
import { getInitials } from '../../utils/helpers';

import RoleChip from '../common/RoleChip';
import CompanyStaffTab from '../tabs/CompanyStaffTab';
import CompanyCashTab from '../tabs/CompanyCashTab';
import CompanyServicesTab from '../tabs/CompanyServicesTab';
import CompanySettingsTab from '../tabs/CompanySettingsTab';

/**
 * Vista principal de gestión de una empresa específica
 * Muestra diferentes tabs según el rol del usuario en la empresa
 */
const CompanyView = () => {
  const { id: companyId } = useParams();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useAuth();
  const { loading, company, error, updateCompany } = useCompany(companyId);
  const { staffMembers, loading: loadingStaff } = useUserStaffMembers(user?.id);
  const permissions = useCompanyPermissions(staffMembers, companyId);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const menuOpen = Boolean(anchorEl);

  const isLoading = loading || loadingStaff || userLoading;
  const isAuthorized = permissions.role && !isLoading;
  

// Obtener las tabs disponibles para el rol actual
  const availableTabs = useMemo(() => {
    return permissions.role ? TABS_BY_ROLE[permissions.role] ?? [] : [];
  }, [permissions.role]);

  // Resetear el tab activo cuando cambia el rol
  useEffect(() => {
    setActiveTab(0);
  }, [permissions.role]);

  useEffect(() => {
}, [user, company, staffMembers, permissions, availableTabs, activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeCompany = () => {
    handleMenuClose();
    navigate('/app/company');
  };

  const handleDeleteCompany = () => {
    handleMenuClose();
    // TODO: Implementar modal de confirmación para eliminar empresa
    console.log('Delete company');
  };

  const renderLoadingSkeleton = () => (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={240} height={36} />
      </Stack>
      <Box sx={{ mt: 3 }}>
        <Skeleton variant="rounded" height={48} />
      </Box>
    </Box>
  );

  const renderNotFound = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Empresa no encontrada
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {error || 'La empresa que buscas no existe o no tienes permisos para acceder a ella.'}
      </Typography>
      <Button onClick={() => navigate('/app/company')}>
        Volver al inicio
      </Button>
    </Box>
  );

  const renderHeader = () => (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar>{getInitials(company.name)}</Avatar>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            {company.name}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {permissions.role && <RoleChip role={permissions.role} />}
            {permissions.role !== ROLES.OWNER && (
              <Tooltip title="Algunas funciones pueden estar restringidas por tu rol">
                <LockIcon fontSize="small" color="action" />
              </Tooltip>
            )}
          </Stack>
        </Box>
      </Stack>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon />
      </IconButton>
    </Stack>
  );

  const renderTabs = () => (
    <>
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        variant= 'scrollable'
        scrollButon= 'auto'
        sx={{ mb: 2 }}
      >
        {availableTabs.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
      <Divider sx={{ mb: 2 }} />
    </>
  );

  const renderTabContent = () => {
    const currentTab = availableTabs[activeTab];
    
    switch (currentTab) {
      case 'Personal':
        return (
          <CompanyStaffTab 
            companyId={company.id} 
            canManage={permissions.canManageStaff}
          />
        );
      case 'Caja':
        return (
          <CompanyCashTab 
            companyId={company.id} 
            canManage={permissions.canManageCash}
          />
        );
      case 'Servicios':
        return (
          <CompanyServicesTab 
            companyId={company.id} 
            canEdit={permissions.canManageServices}
            canProvide={permissions.canManageCash}
          />
        );
      case 'Configuración':
        return (
          <CompanySettingsTab 
            company={company}
            canEdit={permissions.canEditSettings}
            onUpdate={updateCompany}
          />
        );
      default:
        return (
          <Typography variant="body1" color="text.secondary">
            Contenido no disponible
          </Typography>
        );
    }
  };

  const renderMenu = () => (
  <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose} >
    <MenuItem onClick={handleChangeCompany}>
      Cambiar de empresa
    </MenuItem>
    {permissions.role === ROLES.OWNER && (
      <MenuItem onClick={handleDeleteCompany} sx={{ color: 'error.main' }}>
        Eliminar empresa
      </MenuItem>
    )}
  </Menu>
  );

  // Estados de carga y error
  if (isLoading) {
    return renderLoadingSkeleton();
  }

  if (!company || error) {
    return renderNotFound();
  }

  // Si el usuario no tiene un rol en esta compañía
  if (!isAuthorized) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Acceso no autorizado
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No tienes permisos para acceder a esta empresa.
        </Typography>
        <Button onClick={() => navigate('/app/calendar')}>
          Volver al inicio
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, width: '100%' }}>
      {renderHeader()}
      {renderTabs()}
      {renderTabContent()}
      {renderMenu()}
    </Box>
  );
};

export default CompanyView;