import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Stack,
  Skeleton,
  Box,
  Divider,
  Chip
} from '@mui/material';
import CompanyAPI from '../../services/companyAPI';
import { formatCurrency } from '../../utils/helpers';

/**
 * Componente para mostrar una fila clave-valor en el reporte
 */
const ReportRow = ({ label, value, positive, negative, bold }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    <Typography variant="body2">{label}</Typography>
    <Typography 
      variant="body2" 
      sx={{ 
        fontWeight: bold ? 800 : 600, 
        color: positive ? 'success.main' : negative ? 'error.main' : 'text.primary' 
      }}
    >
      {value}
    </Typography>
  </Stack>
);

/**
 * Tab para gestionar la caja de la empresa
 * @param {Object} props - Props del componente
 * @param {string} props.companyId - ID de la empresa
 * @param {boolean} props.canManage - Si el usuario puede gestionar la caja
 * @returns {JSX.Element} Tab de caja
 */
const CompanyCashTab = ({ companyId, canManage }) => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCashReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await CompanyAPI.getCashReport(companyId, 'today');
        setReport(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Error al cargar el reporte de caja');
      } finally {
        setLoading(false);
      }
    };

    fetchCashReport();
  }, [companyId]);

  const handleRegisterPayment = () => {
    // TODO: Implementar registro de pago
    console.log('Registrar pago');
  };

  const handleFilterReport = () => {
    // TODO: Implementar filtros del reporte
    console.log('Filtrar reporte');
  };

  const renderActions = () => {
    if (canManage) {
      return (
        <Stack direction="row" spacing={1}>
          <Button onClick={handleFilterReport}>Filtrar</Button>
          <Button variant="contained" onClick={handleRegisterPayment}>
            Registrar pago
          </Button>
        </Stack>
      );
    }
    return <Chip size="small" label="Solo lectura" />;
  };

  const renderLoadingSkeleton = () => (
    <Stack spacing={1}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={40} />
      ))}
    </Stack>
  );

  const renderReport = () => {
    if (!report) return null;

    return (
      <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Informe del día
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={1}>
            <ReportRow 
              label="Ingreso por turnos" 
              value={formatCurrency(report.incomeFromAppointments)} 
              positive 
            />
            <ReportRow 
              label="Ingresos por anulados" 
              value={formatCurrency(report.incomeFromCanceled)} 
              positive 
            />
            <ReportRow 
              label="Ingresos por no asistencia" 
              value={formatCurrency(report.incomeFromNoShows)} 
              positive 
            />
            <Divider />
            <ReportRow 
              label="Gastos — Insumos" 
              value={formatCurrency(report.expensesSupplies)} 
              negative 
            />
            <ReportRow 
              label="Gastos — Sueldos" 
              value={formatCurrency(report.expensesSalaries)} 
              negative 
            />
            <Divider />
            <ReportRow 
              label="Resultado del período" 
              value={formatCurrency(report.net)} 
              bold 
            />
          </Stack>
        </Paper>
      </Box>
    );
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" fontWeight={800}>
          Caja
        </Typography>
        {renderActions()}
      </Stack>

      {error ? (
        <Typography color="error">{error}</Typography>
      ) : loading ? (
        renderLoadingSkeleton()
      ) : (
        renderReport()
      )}
    </Paper>
  );
};

export default CompanyCashTab;