import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Skeleton,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CompanyAPI from '../../services/companyAPI';
import ServiceAPI from '../../services/serviceAPI';
import StaffMemberAPI from '../../services/staffMemberAPI';
import OfferedServiceAPI from '../../services/offeredServiceAPI';
import { formatCurrency } from '../../utils/helpers';
import ServiceModal from '../modal/ServiceModal';
import ProvideServiceModal from '../modal/ProvideServiceModal';

/**
 * Componente para mostrar una tarjeta de servicio
 */
const ServiceCard = ({ service, canEdit, canProvide, onEdit, onProvide }) => (
  <Card
    variant="outlined"
    sx={{
      borderRadius: 3,
      boxShadow: 2,
      height: 220,
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6,
      },
    }}
  >
    <CardContent
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 2, sm: 3 },
        '&:last-child': { pb: { xs: 2, sm: 3 } },
      }}
    >
      {/* Nombre del servicio */}
      <Typography
        variant="subtitle1"
        fontWeight={700}
        gutterBottom
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical',
          minHeight: '1.6em', 
        }}
      >
        {service.name}
      </Typography>

      {/* Duración y precio en línea */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary" >
          ⏱ {service.suggestedDuration}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          💲 {formatCurrency(service.suggestedPrice)}
        </Typography>
      </Box>

      {/* Descripción */}
      {service.description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            fontStyle: 'italic',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3, // máximo 3 líneas
            WebkitBoxOrient: 'vertical',
            minHeight: '3.9em', // altura fija para 3 líneas
          }}
        >
          {service.description}
        </Typography>
      )}

      {/* Botones alineados abajo */}
      <Stack direction="row" spacing={1} sx={{ mt: 'auto', py: 1 }}>
        {canEdit && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => onEdit(service)}
            sx={{ flex: 1 }}
          >
            Editar
          </Button>
        )}
        {canProvide && (
          <Button
            size="small"
            variant="contained"
            onClick={() => onProvide(service)}
            sx={{ flex: 1 }}
          >
            Prestar
          </Button>
        )}
      </Stack>
    </CardContent>
  </Card>
);

/**
 * Tab para gestionar los servicios de la empresa
 */
const CompanyServicesTab = ({ companyId, canEdit, canProvide }) => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Estados para modales
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [provideModalOpen, setProvideModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [providingService, setProvidingService] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const servicesData = await CompanyAPI.getCompanyServices(companyId);
        setServices(servicesData);

        if (canProvide) {
          const staffData = await StaffMemberAPI.getCompanyStaff(companyId);
          const resolvedStaffData = await Promise.all(staffData);
          setStaffMembers(resolvedStaffData);
        }

      } catch (err) {
        setError(err?.response?.data?.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, canProvide]);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreateService = () => {
    setEditingService(null);
    setServiceModalOpen(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceModalOpen(true);
  };

  const handleProvideService = (service) => {
    setProvidingService(service);
    setProvideModalOpen(true);
  };

  const handleCloseServiceModal = () => {
    setServiceModalOpen(false);
    setEditingService(null);
  };

  const handleCloseProvideModal = () => {
    setProvideModalOpen(false);
    setProvidingService(null);
  };

  const handleServiceSubmit = async (serviceData) => {
    try {
      if (editingService) {
        await ServiceAPI.updateService(editingService.id, serviceData);
        showSuccess('Servicio actualizado correctamente');
      } else {
        await ServiceAPI.createService(companyId, serviceData);
        showSuccess('Servicio creado correctamente');
      }
      const updatedServices = await CompanyAPI.getCompanyServices(companyId);
      setServices(updatedServices);
      handleCloseServiceModal();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al guardar el servicio');
    }
  };

  const handleProvideSubmit = async (offeredServiceData) => {
    try {
      await OfferedServiceAPI.createOfferedService(offeredServiceData);
      showSuccess('Servicio prestado correctamente');
      handleCloseProvideModal();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al prestar el servicio');
    }
  };

  const renderLoadingSkeleton = () => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        gap: 2,
      }}
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          height={220}
          sx={{ borderRadius: 3, width: '100%' }}
        />
      ))}
    </Box>
  );


  const renderServicesGrid = () => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        gap: 2,
      }}
    >
      {services.map((service) => (
        <Box key={service.id}>
          <ServiceCard
            service={service}
            canEdit={canEdit}
            canProvide={canProvide}
            onEdit={handleEditService}
            onProvide={handleProvideService}
          />
        </Box>
      ))}
    </Box>
  );


  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        sx={{ mb: 3 }}
      >
        <Typography variant="h6" fontWeight={800}>
          Servicios
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateService}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Nuevo servicio
          </Button>
        )}
      </Stack>

      {error ? (
        <Typography color="error">{error}</Typography>
      ) : loading ? (
        renderLoadingSkeleton()
      ) : services.length > 0 ? (
        renderServicesGrid()
      ) : (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          No hay servicios disponibles todavía.
        </Typography>
      )}

      {/* Modal para crear/editar servicio */}
      <ServiceModal
        open={serviceModalOpen}
        onClose={handleCloseServiceModal}
        onSubmit={handleServiceSubmit}
        initialData={editingService}
        isEdit={!!editingService}
      />

      {/* Modal para prestar servicio */}
      <ProvideServiceModal
        open={provideModalOpen}
        onClose={handleCloseProvideModal}
        onSubmit={handleProvideSubmit}
        service={providingService}
        staffMembers={staffMembers}
      />

      {/* Snackbar para mensajes de éxito */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CompanyServicesTab;