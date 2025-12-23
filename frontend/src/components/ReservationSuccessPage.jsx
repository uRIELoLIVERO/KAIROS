// components/ReservationSuccess.jsx
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PrintIcon from "@mui/icons-material/Print";

const ReservationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { companyId, serviceId } = useParams();

  const {
    appointmentId,
    clientName,
    serviceName,
    date,
    time,
    professionalName,
  } = location.state || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box textAlign="center" sx={{ mb: 6 }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
        <Typography variant="h3" gutterBottom fontWeight={600}>
          ¡Reserva confirmada!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Tu turno ha sido reservado exitosamente
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, mb: 4, border: "1px solid #e0e0e0" }}>
        <Typography variant="h6" gutterBottom color="primary">
          Detalles de tu reserva
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <PersonIcon sx={{ mr: 2, color: "text.secondary" }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Cliente
              </Typography>
              <Typography variant="body1">
                {clientName || "Nombre no disponible"}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <CalendarTodayIcon sx={{ mr: 2, color: "text.secondary" }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Fecha
              </Typography>
              <Typography variant="body1">
                {date || "Fecha no disponible"}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <AccessTimeIcon sx={{ mr: 2, color: "text.secondary" }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Hora
              </Typography>
              <Typography variant="body1">
                {time || "Hora no disponible"}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <PersonIcon sx={{ mr: 2, color: "text.secondary" }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Profesional
              </Typography>
              <Typography variant="body1">
                {professionalName || "Profesional no disponible"}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center">
            <EmailIcon sx={{ mr: 2, color: "text.secondary" }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Código de reserva
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {appointmentId
                  ? `APT-${appointmentId.substring(0, 8).toUpperCase()}`
                  : "No disponible"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Alert severity="info">
          Presenta este código en recepción. Recibirás un email con todos los
          detalles.
        </Alert>
      </Paper>

      <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          size="large"
        >
          Imprimir comprobante
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate(`/company/${companyId}`)}
          size="large"
        >
          Volver a la empresa
        </Button>

        <Button variant="text" onClick={() => navigate("/")} size="large">
          Ir al inicio
        </Button>
      </Box>

      <Box sx={{ mt: 6, pt: 3, borderTop: "1px solid #e0e0e0" }}>
        <Typography variant="body2" color="text.secondary" align="center">
          ¿Necesitas ayuda o quieres cancelar? Contacta al establecimiento.
        </Typography>
      </Box>
    </Container>
  );
};

export default ReservationSuccess;
