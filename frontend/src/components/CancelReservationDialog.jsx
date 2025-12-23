import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Card,
  CardContent,
  Snackbar,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Cancel as CancelIcon,
  CalendarToday as CalendarTodayIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useAppointments } from "../hooks/useAppointments";
import { Temporal } from "@js-temporal/polyfill";

const COLORS = {
  bg: "#F1F5F8",
  brandDark: "#002C15",
  brandLime: "#C1F43D",
  error: "#d32f2f",
  warning: "#ed6c02",
  border: "rgba(0,0,0,0.06)",
  white: "#FFFFFF",
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function CancelReservationDialog({
  open,
  onClose,
  companyId,
  companyName,
}) {
  // Estados
  const [email, setEmail] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchedAppointments, setSearchedAppointments] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Nueva bandera

  // Hook de appointments
  const {
    loading: loadingAppointments,
    error: searchError,
    searchAppointmentsByEmailAndCompany,
    cancelAppointment: cancelAppointmentHook,
    clearError,
  } = useAppointments();

  // Función para extraer datos del appointment
  const extractAppointmentData = (appointment) => {
    try {
      // El backend ya debe enviar los datos correctamente formateados
      // Solo nos aseguramos de que estén presentes
      const serviceName = appointment.serviceName || "Servicio";
      const staffName = appointment.staffName || "Profesional";
      const duration = appointment.duration || 30;

      // Procesar fechas
      let formattedDate = "Fecha no disponible";
      let formattedStartTime = "";
      let formattedEndTime = "";

      if (appointment.appointmentDateTime) {
        try {
          const date = new Date(appointment.appointmentDateTime);

          // Formatear fecha
          formattedDate = date.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          // Formatear hora de inicio (hora local)
          const startHours = date.getHours().toString().padStart(2, "0");
          const startMinutes = date.getMinutes().toString().padStart(2, "0");
          formattedStartTime = `${startHours}:${startMinutes}`;

          // Calcular hora de fin si no viene del backend
          let endTime = appointment.endTime;
          if (!endTime) {
            const endDate = new Date(date);
            endDate.setMinutes(endDate.getMinutes() + duration);
            const endHours = endDate.getHours().toString().padStart(2, "0");
            const endMinutes = endDate.getMinutes().toString().padStart(2, "0");
            endTime = `${endHours}:${endMinutes}`;
          }
          formattedEndTime = endTime;
        } catch (dateError) {
          console.error("Error procesando fecha:", dateError);
          // Si hay fechas ya formateadas del backend, usarlas
          formattedDate = appointment.date || "Fecha no disponible";
          formattedStartTime = appointment.startTime || "";
          formattedEndTime = appointment.endTime || "";
        }
      }

      return {
        ...appointment,
        serviceName,
        staffName,
        duration,
        formattedDate,
        formattedStartTime,
        formattedEndTime,
      };
    } catch (error) {
      console.error("❌ Error extrayendo datos:", error);
      return {
        ...appointment,
        serviceName: "Servicio",
        staffName: "Profesional",
        formattedDate: "Fecha no disponible",
        formattedStartTime: "",
        formattedEndTime: "",
        duration: 30,
      };
    }
  };

  // Handler para buscar appointments
  const handleSearchAppointments = async () => {
    // Validar email
    if (!email.trim()) {
      setSnackbar({
        open: true,
        message: "Por favor ingrese un email",
        severity: "warning",
      });
      return;
    }

    if (!isValidEmail(email)) {
      setSnackbar({
        open: true,
        message: "Por favor ingrese un email válido",
        severity: "warning",
      });
      return;
    }

    try {
      // Resetear estados
      setIsSearching(true);
      setHasSearched(true); // Marcar que se ha buscado
      clearError();
      setSearchedAppointments([]);
      setSelectedAppointment(null);

      const results = await searchAppointmentsByEmailAndCompany(
        email,
        companyId,
        "pending"
      );

      // Procesar los resultados
      const processedResults = results.map((appointment) =>
        extractAppointmentData(appointment)
      );

      setSearchedAppointments(processedResults);

      // Mostrar mensaje si no hay resultados
      if (!results || results.length === 0) {
        setSnackbar({
          open: true,
          message: "No se encontraron turnos pendientes para este email",
          severity: "info",
        });
      } else {
        // Limpiar cualquier mensaje anterior
        setSnackbar({ open: false, message: "", severity: "success" });
      }
    } catch (error) {
      console.error("❌ Error buscando turnos:", error);
      setSearchedAppointments([]);

      // Mostrar error específico
      const errorMessage = error.message || "Error al buscar los turnos";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleOpenConfirmDialog = () => {
    if (selectedAppointment) {
      setConfirmDialogOpen(true);
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppointment) return;

    setCanceling(true);
    try {
      await cancelAppointmentHook(selectedAppointment.id);

      setSearchedAppointments((prev) =>
        prev.filter((app) => app.id !== selectedAppointment.id)
      );

      setSelectedAppointment(null);

      setSnackbar({
        open: true,
        message: "Turno cancelado exitosamente",
        severity: "success",
      });

      handleCloseConfirmDialog();
    } catch (error) {
      console.error("Error cancelando turno:", error);
      setSnackbar({
        open: true,
        message: "Error al cancelar el turno. Intente nuevamente.",
        severity: "error",
      });
    } finally {
      setCanceling(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setSelectedAppointment(null);
    setSearchedAppointments([]);
    setIsSearching(false);
    setHasSearched(false); // Resetear bandera de búsqueda
    clearError();
    onClose();
  };

  // Mostrar error del hook si existe
  useEffect(() => {
    if (searchError) {
      setSnackbar({
        open: true,
        message: searchError,
        severity: "error",
      });
      clearError();
    }
  }, [searchError, clearError]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            bgcolor: COLORS.brandDark,
            color: COLORS.white,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="span">
            Cancelar Reserva
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: COLORS.white }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Ingrese su email para buscar y cancelar sus reservas pendientes en{" "}
            {companyName}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mt: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // Limpiar resultados y bandera cuando se cambia el email
                if (hasSearched) {
                  setSearchedAppointments([]);
                  setHasSearched(false);
                }
              }}
              onKeyPress={(e) =>
                e.key === "Enter" && handleSearchAppointments()
              }
              placeholder="ejemplo@email.com"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <EmailIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearchAppointments}
              disabled={isSearching || !isValidEmail(email)}
              startIcon={
                isSearching ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SearchIcon />
                )
              }
              sx={{
                bgcolor: COLORS.brandDark,
                "&:hover": { bgcolor: "#001a0c" },
                minWidth: "100px",
              }}
            >
              {isSearching ? "Buscando..." : "Buscar"}
            </Button>
          </Box>

          {isSearching && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {/* SOLO mostrar resultados si se ha realizado una búsqueda */}
          {hasSearched && searchedAppointments.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Turnos pendientes encontrados ({searchedAppointments.length}):
              </Typography>

              <List sx={{ maxHeight: 400, overflow: "auto" }}>
                {searchedAppointments.map((appointment) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem
                      button
                      selected={selectedAppointment?.id === appointment.id}
                      onClick={() => handleSelectAppointment(appointment)}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        border: `1px solid ${COLORS.border}`,
                        "&.Mui-selected": {
                          bgcolor: "rgba(193, 244, 61, 0.15)",
                          borderColor: COLORS.brandLime,
                        },
                        "&:hover": {
                          bgcolor: "rgba(0, 44, 21, 0.04)",
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="bold">
                            {appointment.serviceName}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CalendarTodayIcon fontSize="small" />
                              <Typography variant="body2">
                                {appointment.formattedDate}
                              </Typography>
                            </Box>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mt={0.5}
                            >
                              <ScheduleIcon fontSize="small" />
                              <Typography variant="body2">
                                {appointment.formattedStartTime} -{" "}
                                {appointment.formattedEndTime}
                                {appointment.duration && (
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    sx={{ ml: 1, color: "text.secondary" }}
                                  >
                                    ({appointment.duration} min)
                                  </Typography>
                                )}
                              </Typography>
                            </Box>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mt={0.5}
                            >
                              <PersonIcon fontSize="small" />
                              <Typography variant="body2">
                                Profesional: {appointment.staffName}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        {selectedAppointment?.id === appointment.id ? (
                          <Chip
                            label="Seleccionado"
                            size="small"
                            sx={{
                              bgcolor: COLORS.brandLime,
                              color: COLORS.brandDark,
                              fontWeight: "bold",
                            }}
                          />
                        ) : null}
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}

          {/* SOLO mostrar mensaje de no resultados si se ha buscado y no hay resultados */}
          {hasSearched && !isSearching && searchedAppointments.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No se encontraron turnos pendientes para el email {email}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} color="inherit">
            Cerrar
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<CancelIcon />}
            onClick={handleOpenConfirmDialog}
            disabled={!selectedAppointment}
            sx={{
              bgcolor: COLORS.error,
              "&:hover": { bgcolor: "#c62828" },
            }}
          >
            Cancelar Turno Seleccionado
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación */}
      <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmar Cancelación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro que desea cancelar el turno seleccionado?
          </Typography>
          {selectedAppointment && (
            <Card variant="outlined" sx={{ mt: 2, bgcolor: COLORS.bg }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  {selectedAppointment.serviceName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {selectedAppointment.formattedDate}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Horario: {selectedAppointment.formattedStartTime} -{" "}
                  {selectedAppointment.formattedEndTime}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Profesional: {selectedAppointment.staffName}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 1 }}
                >
                  Email: {email}
                </Typography>
              </CardContent>
            </Card>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} disabled={canceling}>
            Volver
          </Button>
          <Button
            onClick={handleConfirmCancel}
            color="error"
            variant="contained"
            disabled={canceling}
            startIcon={
              canceling ? <CircularProgress size={20} /> : <CancelIcon />
            }
          >
            {canceling ? "Cancelando..." : "Confirmar Cancelación"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
