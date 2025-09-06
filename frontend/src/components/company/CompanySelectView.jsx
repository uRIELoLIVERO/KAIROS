import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  Avatar,
  Typography,
  Button,
  Stack,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useCompanies } from '../../hooks/useCompanies.js';
import CompanyCard from './CompanyCard';
import CreateCompanyDialog from './CreateCompanyDialog';
import ErrorPaper from '../common/ErrorPaper';
import LoadingGrid from '../common/LoadingGrid';

const CompanySelectView = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { loading, companies, error, createCompany } = useCompanies();
  const [openCreate, setOpenCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreateCompany = async (companyName) => {
    try {
      setCreating(true);
      const newCompany = await createCompany(companyName);
      setOpenCreate(false);
      navigate(`/app/company/${newCompany.id}`);
      
    } catch (err) {
      console.error('Error creating company:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleEnterCompany = (companyId) => {
    navigate(`/app/company/${companyId}`);
  };

  const renderCreateNewCard = () => (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <Card
        sx={{
          maxWidth: 280,
          width: '100%',
          height: '100%',
          borderRadius: 3,
          boxShadow: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-4px)',
            backgroundColor: theme.palette.action.hover
          }
        }}
        onClick={() => setOpenCreate(true)}
      >
        <Stack alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56 }}>
            <AddIcon fontSize="large" />
          </Avatar>
          <Typography variant="subtitle1" fontWeight={700}>
            Crear nueva empresa
          </Typography>
          <Button variant="contained" size="small">
            Comenzar
          </Button>
        </Stack>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%' }}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 3, gap: 2 }}
      >
        <Typography variant="h4" fontWeight={700}>
          Elige una empresa
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setOpenCreate(true)}
          size="large"
        >
          Crear empresa
        </Button>
      </Stack>

      {/* Error Display */}
      {error && <ErrorPaper message={error} />}

      {/* Content */}
      {loading ? (
        <LoadingGrid />
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
          {companies.map((company) => (
            <Grid
              item
              key={company.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <CompanyCard
                name={company.name}
                role={company.role}
                logoUrl={company.logoUrl}
                onEnter={() => handleEnterCompany(company.id)}
                sx={{
                  maxWidth: 280,
                  width: '100%',
                  borderRadius: 3,
                  boxShadow: 2,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              />
            </Grid>
          ))}
          {renderCreateNewCard()}
        </Grid>
      )}

      {/* Create Company Dialog */}
      <CreateCompanyDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreateCompany}
        loading={creating}
      />
    </Box>
  );
};

export default CompanySelectView;
