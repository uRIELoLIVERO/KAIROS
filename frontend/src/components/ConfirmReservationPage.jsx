import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";
import AppointmentAPI from "../services/appointmentAPI";

const steps = ["Fecha y hora", "Tus datos", "Confirmación"];

const ConfirmReservationPage = () => {
  const { companyId, serviceId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reservationData = JSON.parse(
    localStorage.getItem("reservationData") || "{}"
  );
  const { serviceDetails, date, timeSlot, clientData } = reservationData;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      const appointmentData = {
        serviceId,
        staffMemberId: serviceDetails.staffMemberId,
        appointmentDatetime: `${date.toISOString().split("T")[0]} ${
          timeSlot.startTime
        }`,
        clientData,
        notes: clientData.notes,
      };

      const response = await AppointmentAPI.createAppointment(appointmentData);

      if (response.success) {
        localStorage.removeItem("reservationData");
        navigate(`/reservar/${companyId}/${serviceId}/exito`, {
          state: { appointmentId: response.data.id },
        });
      } else {
        setError(response.message || "Error al crear la reserva");
      }
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError("Error al procesar la reserva. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!serviceDetails || !date || !timeSlot || !clientData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Datos de reserva no encontrados
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate(`/company/${companyId}`)}
        >
          Volver a la empresa
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stepper activeStep={2} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Confirma tu reserva
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Revisa los detalles antes de confirmar
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 4, mb: 3, border: "1px solid #e0e0e0" }}>
        <Typography variant="h6" gutterBottom color="primary">
          Detalles del servicio
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Servicio" secondary={serviceDetails.name} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AccessTimeIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Duración"
              secondary={`${serviceDetails.duration} minutos`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Profesional"
              secondary={serviceDetails.staffName}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PaymentIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Precio"
              secondary={`$${serviceDetails.price}`}
            />
          </ListItem>
        </List>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
            <Typography variant="h6" gutterBottom color="primary">
              <CalendarTodayIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Fecha y hora
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {formatDate(date)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {timeSlot.startTime} - {timeSlot.endTime}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
            <Typography variant="h6" gutterBottom color="primary">
              <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Tus datos
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {clientData.firstName} {clientData.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {clientData.email}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {clientData.phone}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {clientData.notes && (
        <Paper elevation={0} sx={{ p: 3, mt: 3, border: "1px solid #e0e0e0" }}>
          <Typography variant="h6" gutterBottom color="primary">
            Notas adicionales
          </Typography>
          <Typography variant="body1">{clientData.notes}</Typography>
        </Paper>
      )}

      <Box sx={{ mt: 4, p: 3, bgcolor: "#f8f9fa", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Política de cancelación
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Puedes cancelar tu reserva hasta 24 horas antes sin costo. Las
          cancelaciones con menos de 24 horas podrían tener un cargo.
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          Volver
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleConfirm}
          disabled={loading}
          startIcon={loading ? null : <CheckCircleIcon />}
        >
          {loading ? "Procesando..." : "Confirmar reserva"}
        </Button>
      </Box>
    </Container>
  );
};

export default ConfirmReservationPage;
