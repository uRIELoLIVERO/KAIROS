import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PhoneInput } from "./PhoneInput";
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
  TextField,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import esLocale from "date-fns/locale/es";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from "@mui/icons-material/Phone";

import { useServiceDetails } from "../hooks/useServiceDetails";
import { useAvailability } from "../hooks/useAvailability";
import { useAppointments } from "../hooks/useAppointments";

import { generateAvailableSlots } from "../utils/timeSlotGenerator";

const steps = ["Fecha y hora", "Tus datos", "Confirmar"];

// Función para formatear día de la semana
const getDayOfWeekName = (date) => {
  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  return days[date.getDay()];
};

const ReservationWizard = () => {
  const { companyId, serviceId } = useParams();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [allTimeSlots, setAllTimeSlots] = useState([]);

  // Estados del formulario
  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  // Solo un estado de errores
  const [errors, setErrors] = useState({});
  const [reservationError, setReservationError] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const {
    service,
    loading: loadingService,
    error: errorService,
  } = useServiceDetails(serviceId);

  // Usar el hook de disponibilidad
  const {
    availability,
    loading: loadingAvailability,
    error: errorAvailability,
  } = useAvailability(service?.staffMemberId);

  // Usar el hook unificado de appointments
  const {
    appointments: bookedAppointments,
    createAppointment,
    loading: appointmentsLoading,
    error: appointmentsError,
  } = useAppointments(service?.staffMemberId, selectedDate);

  // Función de validación mejorada
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          newErrors.firstName = "El nombre es requerido";
        } else if (value.length < 2) {
          newErrors.firstName = "El nombre debe tener al menos 2 caracteres";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          newErrors.firstName =
            "El nombre solo puede contener letras y espacios";
        } else {
          delete newErrors.firstName;
        }
        break;

      case "lastName":
        if (!value.trim()) {
          newErrors.lastName = "El apellido es requerido";
        } else if (value.length < 2) {
          newErrors.lastName = "El apellido debe tener al menos 2 caracteres";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          newErrors.lastName =
            "El apellido solo puede contener letras y espacios";
        } else {
          delete newErrors.lastName;
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors.email = "El email es requerido";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email =
            "Por favor ingresa un email válido (ej: usuario@dominio.com)";
        } else {
          delete newErrors.email;
        }
        break;

      case "phone":
        if (!value.trim()) {
          newErrors.phone = "El teléfono es requerido";
        } else if (!/^[1-9]\d{1,14}$/.test(value)) {
          newErrors.phone =
            "Formato inválido. Debe ser incluir el código de país (ej: +542657204235)";
        } else if (value.length < 10) {
          newErrors.phone = "El número es demasiado corto";
        } else if (value.length > 16) {
          newErrors.phone = "El número es demasiado largo";
        } else {
          delete newErrors.phone;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[name]; // Retorna true si no hay error
  };

  // Validar todos los campos antes de avanzar
  const validateStep2 = () => {
    // Validar todos los campos
    const fieldsToValidate = ["firstName", "lastName", "email", "phone"];
    const validationResults = fieldsToValidate.map((field) =>
      validateField(field, clientData[field])
    );

    // Verificar si hay algún error
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      setReservationError("Por favor corrige los errores en tus datos");
      return false;
    }

    // Validación adicional de campos requeridos
    const requiredFields = ["firstName", "lastName", "email", "phone"];
    const missingFields = requiredFields.filter(
      (field) => !clientData[field].trim()
    );

    if (missingFields.length > 0) {
      setReservationError("Todos los campos marcados con * son obligatorios");
      return false;
    }

    setReservationError(null);
    return true;
  };

  // Manejar cambio de campo
  const handleClientDataChange = (e) => {
    const { name, value } = e.target;
    setClientData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Extraer días disponibles y time slots de la disponibilidad
  useEffect(() => {
    if (!availability) {
      setAvailableDays([]);
      setAllTimeSlots([]);
      return;
    }

    // Extraer días disponibles
    if (
      availability.availability_days &&
      Array.isArray(availability.availability_days)
    ) {
      const enabledDays = availability.availability_days
        .filter((day) => day.isEnabled)
        .map((day) => day.dayOfWeek);
      setAvailableDays(enabledDays);
    }

    // Extraer todos los time slots
    if (availability.timeSlots && Array.isArray(availability.timeSlots)) {
      setAllTimeSlots(availability.timeSlots);
    }
  }, [availability]);

  // Calcular horarios disponibles según fecha seleccionada
  useEffect(() => {
    if (!selectedDate || !availability || !service) {
      setAvailableTimeSlots([]);
      return;
    }

    setLoadingSlots(true);

    const selectedDayOfWeek = getDayOfWeekName(selectedDate);

    if (!availableDays.includes(selectedDayOfWeek)) {
      setAvailableTimeSlots([]);
      setSelectedTimeSlot(null);
      setLoadingSlots(false);
      return;
    }

    try {
      // Filtrar slots base del día seleccionado
      const baseSlotsForDay = allTimeSlots.filter(
        (slot) => slot.dayOfWeek === selectedDayOfWeek
      );

      if (baseSlotsForDay.length === 0) {
        setAvailableTimeSlots([]);
        setLoadingSlots(false);
        return;
      }

      // Obtener duración y buffer del servicio
      const duration =
        service.customDuration || service.service?.suggestedDuration || 30;
      const buffer = service.customBuffer || 0;

      // Transformar bookedAppointments al formato esperado
      const formattedBookedSlots = bookedAppointments
        .filter((app) => app && app.appointmentDateTime)
        .map((app) => {
          try {
            const appointmentDate = new Date(app.appointmentDateTime);

            // Calcular endTime basado en la duración del servicio de esa cita
            const appointmentDuration =
              app.OfferedService?.customDuration ||
              app.OfferedService?.service?.suggestedDuration ||
              duration;

            const endTime = new Date(appointmentDate);
            endTime.setMinutes(endTime.getMinutes() + appointmentDuration);

            return {
              startTime: appointmentDate.toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              }),
              endTime: endTime.toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          } catch (err) {
            console.error("Error transformando cita:", app, err);
            return null;
          }
        })
        .filter((slot) => slot !== null);

      // Generar slots para cada franja horaria base
      let allGeneratedSlots = [];

      baseSlotsForDay.forEach((baseSlot) => {
        const generatedSlots = generateAvailableSlots({
          startTime: baseSlot.startTime,
          endTime: baseSlot.endTime,
          duration: duration,
          buffer: buffer,
          bookedSlots: formattedBookedSlots,
        });

        // Agregar información adicional a cada slot
        const enhancedSlots = generatedSlots.map((slot) => ({
          ...slot,
          id: `${baseSlot.id}-${slot.startTime.replace(":", "")}`,
          dayOfWeek: selectedDayOfWeek,
          baseSlotId: baseSlot.id,
          serviceId: serviceId,
        }));

        allGeneratedSlots = [...allGeneratedSlots, ...enhancedSlots];
      });

      setAvailableTimeSlots(allGeneratedSlots);
    } catch (error) {
      console.error("Error al generar slots:", error);
      setAvailableTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [
    selectedDate,
    allTimeSlots,
    availableDays,
    service,
    bookedAppointments,
    serviceId,
  ]);

  // Función para deshabilitar fechas no disponibles
  const shouldDisableDate = (date) => {
    if (!availableDays || availableDays.length === 0) {
      return true;
    }

    const dayOfWeek = getDayOfWeekName(date);
    return !availableDays.includes(dayOfWeek);
  };

  // Validar paso 1: fecha y hora
  const validateStep1 = () => {
    if (!selectedDate) {
      setReservationError("Por favor selecciona una fecha");
      return false;
    }

    const selectedDayOfWeek = getDayOfWeekName(selectedDate);
    if (!availableDays.includes(selectedDayOfWeek)) {
      setReservationError("La fecha seleccionada no está disponible");
      return false;
    }

    if (!selectedTimeSlot) {
      setReservationError("Por favor selecciona un horario");
      return false;
    }

    setReservationError(null);
    return true;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateStep1()) return;
    if (activeStep === 1 && !validateStep2()) return;

    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setReservationError(null);
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setReservationError(null);

    try {
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTimeSlot.startTime.split(":");
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0);

      const appointmentData = {
        appointmentDateTime: appointmentDateTime.toISOString(),
        offeredServiceId: serviceId,
        client: {
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          email: clientData.email,
          phoneNumber: clientData.phone,
        },
        notes: clientData.notes,
      };

      // Usar el hook unificado
      const response = await createAppointment(appointmentData);

      navigate(`/reservar/${companyId}/${serviceId}/exito`, {
        state: {
          appointmentId: response.id,
          clientName: `${clientData.firstName} ${clientData.lastName}`,
          serviceName: service.name,
          date: selectedDate.toLocaleDateString("es-ES"),
          time: selectedTimeSlot.startTime.slice(0, 5),
          professionalName: service.staffName,
        },
      });
    } catch (error) {
      console.error("Error al crear reserva:", error);
      let errorMessage = appointmentsError || "Error al procesar la reserva";

      if (
        errorMessage.includes("horario") ||
        errorMessage.includes("reservado")
      ) {
        errorMessage = "Este horario ya está reservado";
        setActiveStep(0);
      }

      setReservationError(errorMessage);
    }
  };

  // Combinar loading states
  const isProcessing = appointmentsLoading;

  // Renderizado de estados de carga
  if (loadingService) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Cargando servicio...
        </Typography>
      </Container>
    );
  }

  if (errorService || !service) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorService || "Servicio no encontrado"}
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
      {/* Resumen del servicio */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 4, bgcolor: "#f8f9fa", border: "1px solid #e0e0e0" }}
      >
        <Typography variant="h5" gutterBottom fontWeight={600}>
          {service.name}
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Box display="flex" alignItems="center">
                <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="body1">{service.staffName}</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <AccessTimeIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="body1">
                  {service.duration} minutos
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h5" color="primary" align="right">
              ${service.price}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Errores generales */}
      {reservationError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {reservationError}
        </Alert>
      )}

      {/* Paso 1: Fecha y Hora */}
      {activeStep === 0 && (
        <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0" }}>
          <Typography variant="h6" gutterBottom>
            <CalendarTodayIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Selecciona fecha y hora
          </Typography>

          {errorAvailability && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {errorAvailability}
            </Alert>
          )}

          {availableDays.length === 0 && !loadingAvailability && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Este profesional no tiene días disponibles configurados. Contacta
              al establecimiento para más información.
            </Alert>
          )}

          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={esLocale}
          >
            <DatePicker
              label="Elige una fecha"
              value={selectedDate}
              onChange={(newDate) => {
                setSelectedDate(newDate);
                setSelectedTimeSlot(null);
              }}
              disablePast
              shouldDisableDate={shouldDisableDate}
              disabled={availableDays.length === 0}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: { mb: 3 },
                  helperText:
                    availableDays.length > 0
                      ? `Días disponibles: ${availableDays
                          .map((d) => d.charAt(0) + d.slice(1).toLowerCase())
                          .join(", ")}`
                      : "Sin días disponibles configurados",
                },
              }}
            />
          </LocalizationProvider>

          {selectedDate && (
            <>
              <Divider sx={{ my: 2 }} />

              {loadingSlots ? (
                <Box textAlign="center" py={2}>
                  <CircularProgress size={24} />
                  <Typography variant="body2">Cargando horarios...</Typography>
                </Box>
              ) : availableTimeSlots.length > 0 ? (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Horarios disponibles para{" "}
                    {selectedDate.toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                    >
                      Duración: {service.duration} min • Intervalo:{" "}
                      {service.customBuffer || 0} min
                    </Typography>
                  </Typography>

                  <Grid container spacing={1}>
                    {availableTimeSlots.map((slot, index) => (
                      <Grid item key={index}>
                        <Chip
                          label={`${slot.startTime.slice(0, 5)}`}
                          onClick={() => setSelectedTimeSlot(slot)}
                          color={
                            selectedTimeSlot?.startTime === slot.startTime
                              ? "primary"
                              : "default"
                          }
                          variant="outlined"
                          sx={{
                            fontSize: "0.9rem",
                            padding: 1.5,
                            minWidth: 80,
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "action.hover",
                            },
                          }}
                          title={`${slot.startTime.slice(
                            0,
                            5
                          )} - ${slot.endTime.slice(0, 5)} (${
                            service.duration
                          } min)`}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </>
              ) : (
                <Alert severity="info">
                  {availableDays.length === 0
                    ? "No hay horarios configurados para este profesional."
                    : "No hay horarios disponibles para esta fecha. Por favor selecciona otra."}
                </Alert>
              )}
            </>
          )}
        </Paper>
      )}

      {/* Paso 2: Datos personales */}
      {activeStep === 1 && (
        <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0" }}>
          <Typography variant="h6" gutterBottom>
            <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Tus datos personales
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Estos datos se usarán para contactarte y confirmar tu reserva. Los
            campos marcados con * son obligatorios.
          </Typography>

          <Grid container spacing={3}>
            {/* Nombre */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Nombre"
                name="firstName"
                value={clientData.firstName}
                onChange={handleClientDataChange}
                onBlur={(e) => validateField("firstName", e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName || "Ej: Juan"}
                required
                autoComplete="given-name"
                variant="outlined"
              />
            </Grid>

            {/* Apellido */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Apellido"
                name="lastName"
                value={clientData.lastName}
                onChange={handleClientDataChange}
                onBlur={(e) => validateField("lastName", e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName || "Ej: Pérez"}
                required
                autoComplete="family-name"
                variant="outlined"
              />
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={clientData.email}
                onChange={handleClientDataChange}
                onBlur={(e) => validateField("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email || "Ej: juan@email.com"}
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                required
                autoComplete="email"
                variant="outlined"
              />
            </Grid>

            {/* Teléfono con código de país */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Teléfono"
                name="phone"
                value={clientData.phone}
                onChange={handleClientDataChange}
                onBlur={(e) => validateField("phone", e.target.value)}
                error={!!errors.phone}
                helperText={
                  errors.phone || "Ej: +542657204235 (con código de país)"
                }
                InputProps={{
                  startAdornment: (
                    <PhoneIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                required
                autoComplete="tel"
                variant="outlined"
                placeholder="+542657204235"
              />

              {/* Información sobre formato */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Incluye el código de país. Ejemplos: +542657204235 (Argentina),
                +56912345678 (Chile)
              </Typography>
            </Grid>

            {/* Notas adicionales */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Notas adicionales (opcional)"
                name="notes"
                value={clientData.notes}
                onChange={handleClientDataChange}
                multiline
                rows={3}
                placeholder="Comentarios, necesidades especiales, alergias, preferencias, etc."
                variant="outlined"
                helperText="Estas notas solo serán visibles para el profesional"
              />
            </Grid>

            {/* Información de privacidad */}
            <Grid size={{ xs: 12 }}>
              <Alert severity="info" icon={false} sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Privacidad de datos:</strong> Tu información personal
                  será utilizada únicamente para contactarte respecto a esta
                  reserva. No compartiremos tus datos con terceros sin tu
                  consentimiento.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Paso 3: Confirmación */}
      {activeStep === 2 && (
        <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0" }}>
          <Typography variant="h6" gutterBottom color="primary">
            <CheckCircleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Confirma tu reserva
          </Typography>

          <Box sx={{ mt: 3, p: 3, bgcolor: "#f8f9fa", borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Servicio
                </Typography>
                <Typography variant="body1">{service.name}</Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Precio
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  ${service.price}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Fecha
                </Typography>
                <Typography variant="body1">
                  {selectedDate?.toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Hora
                </Typography>
                <Typography variant="body1">
                  {selectedTimeSlot?.startTime.slice(0, 5)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Profesional
                </Typography>
                <Typography variant="body1">{service.staffName}</Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Duración
                </Typography>
                <Typography variant="body1">
                  {service.duration} minutos
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tus datos
                </Typography>
                <Typography variant="body1">
                  {clientData.firstName} {clientData.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {clientData.email} • {clientData.phone}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              • Recibirás un email de confirmación
              <br />
              • Puedes cancelar hasta 24 horas antes sin costo
              <br />• Llega 10 minutos antes de tu turno
            </Typography>
          </Alert>
        </Paper>
      )}

      {/* Botones de navegación */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || isProcessing}
          variant="outlined"
          size="large"
        >
          {activeStep === 0 ? "Cancelar" : "Atrás"}
        </Button>

        <Button
          onClick={handleNext}
          variant="contained"
          size="large"
          disabled={isProcessing || (activeStep === 0 && !selectedTimeSlot)}
          startIcon={isProcessing ? <CircularProgress size={20} /> : null}
        >
          {isProcessing
            ? "Procesando..."
            : activeStep === steps.length - 1
            ? "Confirmar reserva"
            : "Siguiente"}
        </Button>
      </Box>
    </Container>
  );
};

export default ReservationWizard;
