import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import esLocale from "date-fns/locale/es";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";

import { useServiceDetails } from "../hooks/useServiceDetails";
import { useAvailability } from "../hooks/useAvailability";

const ReservationPage = () => {
  const { companyId, serviceId } = useParams();
  const navigate = useNavigate();

  const {
    service,
    loading: loadingService,
    error: errorService,
  } = useServiceDetails(serviceId);
  const { availability, loading: loadingAvailability } = useAvailability(
    service?.staffMemberId
  );

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
    if (selectedDate && availability.timeSlots) {
      const dayOfWeek = selectedDate.getDay();
      const dayName = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ][dayOfWeek];

      const daySlots = availability.timeSlots.filter(
        (slot) => slot.dayOfWeek === dayName && !slot.isBooked
      );
      setAvailableTimeSlots(daySlots);
    }
  }, [selectedDate, availability]);

  const handleNext = () => {
    if (selectedDate && selectedTimeSlot) {
      const appointmentData = {
        serviceId,
        companyId,
        staffMemberId: service.staffMemberId,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        serviceDetails: service,
      };
      localStorage.setItem("reservationData", JSON.stringify(appointmentData));
      navigate(`/reservar/${companyId}/${serviceId}/datos`);
    }
  };

  if (loadingService) return <CircularProgress />;
  if (errorService) return <Alert severity="error">{errorService}</Alert>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Reservar Servicio
      </Typography>

      <Paper elevation={0} sx={{ p: 3, mb: 3, border: "1px solid #e0e0e0" }}>
        <Typography variant="h6" gutterBottom>
          {service.name}
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
              <Typography variant="body2">{service.staffName}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <AccessTimeIcon sx={{ mr: 1, color: "text.secondary" }} />
              <Typography variant="body2">
                {service.duration} minutos
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" color="primary" align="right">
              ${service.price}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, mb: 3, border: "1px solid #e0e0e0" }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <CalendarTodayIcon sx={{ mr: 1 }} />
          Seleccionar Fecha
        </Typography>

        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={esLocale}
        >
          <DatePicker
            label="Elegir fecha"
            value={selectedDate}
            onChange={(newDate) => {
              setSelectedDate(newDate);
              setSelectedTimeSlot(null);
            }}
            disablePast
            shouldDisableDate={(date) => {
              const dayOfWeek = date.getDay();
              const dayName = [
                "SUNDAY",
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY",
              ][dayOfWeek];
              return !availability.availableDays?.includes(dayName);
            }}
            sx={{ width: "100%", mb: 3 }}
          />
        </LocalizationProvider>

        {selectedDate && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Horarios Disponibles
            </Typography>
            {loadingAvailability ? (
              <CircularProgress size={24} />
            ) : availableTimeSlots.length > 0 ? (
              <Grid container spacing={1}>
                {availableTimeSlots.map((slot, index) => (
                  <Grid item key={index}>
                    <Chip
                      label={slot.startTime}
                      onClick={() => setSelectedTimeSlot(slot)}
                      color={
                        selectedTimeSlot?.id === slot.id ? "primary" : "default"
                      }
                      variant={
                        selectedTimeSlot?.id === slot.id ? "filled" : "outlined"
                      }
                      sx={{ fontSize: "1rem", padding: 2 }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                No hay horarios disponibles para esta fecha
              </Alert>
            )}
          </>
        )}
      </Paper>

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Volver
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!selectedDate || !selectedTimeSlot}
        >
          Continuar con mis datos
        </Button>
      </Box>
    </Container>
  );
};

export default ReservationPage;
