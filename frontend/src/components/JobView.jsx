import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
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
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tabs,
  Tab,
  Switch,
  List,
  ListItem,
  CircularProgress,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import BusinessIcon from "@mui/icons-material/Business";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { es } from "date-fns/locale";

import { Temporal } from "@js-temporal/polyfill";

// Hooks
import { useAuth } from "../hooks/useAuth";
import { useUserStaffMembers } from "../hooks/useUserStaffMembers";
import { useAvailability } from "../hooks/useAvailability";
import { useAvailabilityDays } from "../hooks/useAvailabilityDays";
import { useTimeSlots } from "../hooks/useTimeSlots";
import { useAvailabilityExceptions } from "../hooks/useAvailabilityException";
import { useOfferedServices } from "../hooks/useOfferedServices";

import { formatCurrency } from "../utils/helpers";

// --- (INICIO) COMPONENTES AUXILIARES ---

const DIAS_SEMANA = [
  { key: "MONDAY", label: "Lunes" },
  { key: "TUESDAY", label: "Martes" },
  { key: "WEDNESDAY", label: "Miércoles" },
  { key: "THURSDAY", label: "Jueves" },
  { key: "FRIDAY", label: "Viernes" },
  { key: "SATURDAY", label: "Sábado" },
  { key: "SUNDAY", label: "Domingo" },
];

// --- Sub-componente para gestionar cada día ---
function DayAvailabilityCard({ dayData, onToggleDay }) {
  const theme = useTheme();
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const {
    timeSlots,
    loading: loadingSlots,
    createTimeSlot,
    deleteTimeSlot,
    error: slotError,
    refetch: fetchTimeSlots,
  } = useTimeSlots(dayData.id);

  const handleAddSlot = async () => {
    setError("");
    if (!newStartTime || !newEndTime) {
      setError("Debes especificar una hora de inicio y fin.");
      return;
    }
    if (newStartTime >= newEndTime) {
      setError("La hora de inicio debe ser anterior a la hora de fin.");
      return;
    }

    const isOverlapping = timeSlots.some(
      (slot) => newStartTime < slot.endTime && newEndTime > slot.startTime
    );
    if (isOverlapping) {
      setError("El nuevo turno se solapa con uno existente.");
      return;
    }

    try {
      await createTimeSlot({ startTime: newStartTime, endTime: newEndTime });
      setNewStartTime("");
      setNewEndTime("");
      await fetchTimeSlots();
    } catch (err) {
      setError(err.message || "Error al crear el turno");
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await deleteTimeSlot(slotId);
      await fetchTimeSlots();
    } catch (err) {
      setError(err.message || "Error al eliminar el turno");
    }
  };

  const hasValidId = !!dayData.id;

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${
          dayData.isEnabled ? theme.palette.primary.main : theme.palette.divider
        }`,
        opacity: hasValidId ? 1 : 0.7,
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          backgroundColor: dayData.isEnabled
            ? "transparent"
            : theme.palette.grey[100],
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Stack spacing={0.5}>
          <Typography
            variant="h6"
            fontWeight={600}
            color={dayData.isEnabled ? "text.primary" : "text.secondary"}
          >
            {dayData.label}
            {!hasValidId && (
              <Chip
                label="No configurado"
                size="small"
                color="warning"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {dayData.isEnabled
              ? `${timeSlots.length} franja${timeSlots.length !== 1 ? "s" : ""}`
              : "Cerrado"}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FormControlLabel
            control={
              <Switch
                checked={dayData.isEnabled || false}
                disabled={!dayData.id}
                onChange={(e) => onToggleDay(dayData.id, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
              />
            }
            label={dayData.isEnabled ? "Abierto" : "Cerrado"}
            onClick={(e) => e.stopPropagation()}
            sx={{ mr: 1 }}
          />
          {hasValidId && (
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </Stack>
      </Box>
      {hasValidId && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider />
          <Box sx={{ p: 2, opacity: dayData.isEnabled ? 1 : 0.5 }}>
            {!dayData.id ? (
              <Alert severity="info">
                Debes habilitar este día para poder agregar franjas horarias.
              </Alert>
            ) : loadingSlots ? (
              <CircularProgress
                size={24}
                sx={{ mx: "auto", display: "block" }}
              />
            ) : (
              <Stack spacing={2}>
                {timeSlots.length > 0 ? (
                  <List dense disablePadding>
                    {timeSlots.map((slot) => (
                      <ListItem
                        key={slot.id}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteSlot(slot.id)}
                            disabled={!dayData.isEnabled}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                        sx={{
                          backgroundColor: theme.palette.grey[50],
                          borderRadius: 1.5,
                          mb: 1,
                          pl: 1.5,
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <AccessTimeIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${slot.startTime} - ${slot.endTime}`}
                          primaryTypographyProps={{
                            fontWeight: 500,
                            fontSize: "1rem",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ py: 1 }}
                  >
                    No hay franjas horarias definidas para este día.
                  </Typography>
                )}
                <Divider>Añadir franja horaria</Divider>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                >
                  <TextField
                    label="Hora de inicio"
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                    sx={{ flex: 1, minWidth: "130px" }}
                    fullWidth
                    disabled={!dayData.isEnabled}
                  />
                  <TextField
                    label="Hora de fin"
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                    sx={{ flex: 1, minWidth: "130px" }}
                    fullWidth
                    disabled={!dayData.isEnabled}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddSlot}
                    startIcon={<AddCircleOutlineIcon />}
                    disabled={!dayData.isEnabled}
                    sx={{
                      flexShrink: 0,
                      height: "56px",
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    Añadir
                  </Button>
                </Stack>
                {(error || slotError) && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {error || slotError}
                  </Alert>
                )}
              </Stack>
            )}
          </Box>
        </Collapse>
      )}
    </Paper>
  );
}

// --- Pestaña de Excepciones ---
function ExceptionsTab({ staffMemberId }) {
  const theme = useTheme();

  const { exceptions, loading, createException, deleteException, error } =
    useAvailabilityExceptions(staffMemberId);

  const [formError, setFormError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);

  const resetForm = () => {
    setStartDate(null);
    setEndDate(null);
    setReason("");
    setIsAllDay(false);
    setStartTime(null);
    setEndTime(null);
    setFormError(null);
    setIsAvailable(false);
  };

  const combineDateTime = (date, time) => {
    if (!date) return null;
    const newDate = new Date(date);
    if (time) {
      newDate.setHours(time.getHours());
      newDate.setMinutes(time.getMinutes());
      newDate.setSeconds(time.getSeconds());
    }
    return newDate;
  };

  const handleAddException = async () => {
    setFormError(null);

    if (!startDate || !reason) {
      setFormError("La fecha de inicio y la razón son obligatorias.");
      return;
    }
    if (!isAllDay && (!startTime || !endTime)) {
      setFormError(
        "Debe especificar una hora de inicio y fin para excepciones parciales."
      );
      return;
    }
    if (!isAllDay && startTime >= endTime) {
      setFormError("La hora de inicio debe ser anterior a la hora de fin.");
      return;
    }

    let finalStartDate;
    let finalEndDate;
    const effectiveEndDate = endDate || startDate;

    if (isAllDay) {
      finalStartDate = new Date(startDate);
      finalStartDate.setHours(0, 0, 0, 0);

      finalEndDate = new Date(effectiveEndDate);
      finalEndDate.setHours(23, 59, 59, 999);
    } else {
      finalStartDate = combineDateTime(startDate, startTime);
      finalEndDate = combineDateTime(effectiveEndDate, endTime);
    }

    const payload = {
      isAvailable: isAvailable,
      reason: reason,
      startDatetime: finalStartDate.toISOString(),
      endDatetime: finalEndDate.toISOString(),
    };

    try {
      await createException(payload);
      resetForm();
    } catch (error) {
      console.error("Error creating exception:", error);
      setFormError(
        error?.response?.data?.error ||
          error.message ||
          "Error al guardar la excepción"
      );
    }
  };

  const handleDeleteException = async (id) => {
    try {
      await deleteException(id);
    } catch (error) {
      console.error("Error deleting exception:", error);
    }
  };

  const formatTemporalRange = (startStr, endStr) => {
    if (!startStr || !endStr) {
      return "Fechas incompletas";
    }

    try {
      const parseAndZone = (datetimeStr) => {
        const plainStr = datetimeStr.slice(0, -1);
        const plainDateTime = Temporal.PlainDateTime.from(plainStr);
        const zonedDateTimeUTC = plainDateTime.toZonedDateTime("UTC");
        return zonedDateTimeUTC.withTimeZone(Temporal.Now.timeZoneId());
      };

      const start = parseAndZone(startStr);
      const end = parseAndZone(endStr);

      const timeFormat = { hour: "2-digit", minute: "2-digit" };
      const dateFormat = { day: "2-digit", month: "2-digit", year: "numeric" };
      const fullFormat = { ...dateFormat, ...timeFormat };
      const locale = "es-AR";

      if (start.toPlainDate().equals(end.toPlainDate())) {
        return `${start
          .toPlainDate()
          .toLocaleString(locale, dateFormat)}, ${start
          .toPlainTime()
          .toLocaleString(locale, timeFormat)} - ${end
          .toPlainTime()
          .toLocaleString(locale, timeFormat)}`;
      } else {
        return `${start.toLocaleString(
          locale,
          fullFormat
        )} - ${end.toLocaleString(locale, fullFormat)}`;
      }
    } catch (error) {
      console.error("Error fatal en formatTemporalRange:", error.message);
      return "Error de formato";
    }
  };

  const getExceptionIcon = (isAvailable) => {
    return isAvailable ? (
      <EventBusyIcon color="success" />
    ) : (
      <EventBusyIcon color="error" />
    );
  };

  const getExceptionText = (isAvailable) => {
    return isAvailable ? "Disponible" : "No disponible";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Stack spacing={3}>
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Añadir excepción
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label="Fecha de Inicio"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label="Fecha de Fin (opcional)"
                value={endDate}
                onChange={setEndDate}
                minDate={startDate}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    helperText="Dejar vacío si es un solo día"
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Razón (ej. Feriado, Vacaciones)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      color={isAvailable ? "success" : "default"}
                    />
                  }
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {getExceptionIcon(isAvailable)}
                      <Typography
                        color={isAvailable ? "success.main" : "error.main"}
                        fontWeight="medium"
                      >
                        {getExceptionText(isAvailable)}
                      </Typography>
                    </Stack>
                  }
                />
              </FormGroup>
              <Typography variant="caption" color="text.secondary">
                {isAvailable
                  ? "Marca este período como tiempo disponible (ej. horario extra)"
                  : "Marca este período como tiempo no disponible (ej. vacaciones, feriado)"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isAllDay}
                      onChange={(e) => setIsAllDay(e.target.checked)}
                    />
                  }
                  label="Todo el día"
                />
              </FormGroup>
            </Grid>
            {!isAllDay && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TimePicker
                    label="Hora de inicio"
                    value={startTime}
                    onChange={setStartTime}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TimePicker
                    label="Hora de fin"
                    value={endTime}
                    onChange={setEndTime}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </Grid>
              </>
            )}
            {formError && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="error">{formError}</Alert>
              </Grid>
            )}
            <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddException}
              >
                Guardar excepción
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <Divider>Excepciones guardadas</Divider>
        {error && <Alert severity="error">{error}</Alert>}
        {loading ? (
          <CircularProgress sx={{ mx: "auto" }} />
        ) : (
          <List>
            {exceptions.map((ex) => (
              <ListItem
                key={ex.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteException(ex.id)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                }
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: 1.5,
                  mb: 1,
                  borderLeft: `6px solid ${
                    ex.isAvailable
                      ? theme.palette.success.main
                      : theme.palette.error.main
                  }`,
                }}
              >
                <ListItemIcon>
                  <EventBusyIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={ex.isAvailable ? "Disponible" : "No disponible"}
                        size="small"
                        color={ex.isAvailable ? "success" : "error"}
                        variant={ex.isAvailable ? "outlined" : "filled"}
                      />
                      <Typography variant="body1" fontWeight="medium">
                        {ex.reason}
                      </Typography>
                    </Box>
                  }
                  secondary={formatTemporalRange(
                    ex.startDatetime,
                    ex.endDatetime
                  )}
                />
              </ListItem>
            ))}
            {exceptions.length === 0 && !loading && (
              <Typography color="text.secondary" textAlign="center">
                No hay excepciones guardadas.
              </Typography>
            )}
          </List>
        )}
      </Stack>
    </LocalizationProvider>
  );
}

// --- Componente principal del Modal de Disponibilidad ---
const AvailabilityDialog = React.memo(({ open, onClose, staffMemberId }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabIndex, setTabIndex] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const {
    availability,
    loading: loadingAvailability,
    error: availabilityError,
    createAvailability,
    refetch: refetchAvailability,
  } = useAvailability(staffMemberId);

  const {
    days,
    loading: loadingDays,
    error: daysError,
    updateDay,
  } = useAvailabilityDays(availability?.id);

  const formattedDays = useMemo(() => {
    return DIAS_SEMANA.map((dia) => {
      const dbDay = days.find((d) => d.dayOfWeek === dia.key);
      return {
        id: dbDay?.id,
        label: dia.label,
        dayOfWeek: dia.key,
        isEnabled: dbDay?.isEnabled || false,
      };
    });
  }, [days]);

  const handleTabChange = useCallback((event, newValue) => {
    setTabIndex(newValue);
  }, []);

  const handleToggleDay = useCallback(
    async (dayId, isEnabled) => {
      if (!dayId) return;

      try {
        await updateDay(dayId, { isEnabled });
      } catch (err) {
        console.error("Error al actualizar el día:", err);
      }
    },
    [updateDay]
  );

  const handleCreateAvailability = useCallback(async () => {
    setIsCreating(true);
    try {
      await createAvailability({ staffMemberId, name: "Horario Principal" });
      refetchAvailability?.();
    } catch (err) {
      console.error("Error al crear disponibilidad:", err);
    } finally {
      setIsCreating(false);
    }
  }, [createAvailability, staffMemberId, refetchAvailability]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
    >
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <DateRangeIcon />
        Configurar Disponibilidad
      </DialogTitle>

      {availability && (
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="fullWidth"
            centered
          >
            <Tab label="Horario Semanal" icon={<ScheduleIcon />} />
            <Tab label="Excepciones" icon={<EventBusyIcon />} />
          </Tabs>
        </Box>
      )}

      <DialogContent dividers>
        {loadingAvailability ? (
          <Box
            sx={{
              minHeight: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : availabilityError && !availability ? (
          <Box textAlign="center" sx={{ p: 4 }}>
            <DateRangeIcon
              sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              No tienes un horario configurado
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Crea un horario base para comenzar a configurar tu disponibilidad.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleCreateAvailability}
              disabled={isCreating}
            >
              {isCreating ? (
                <CircularProgress size={24} />
              ) : (
                "Crear Horario Principal"
              )}
            </Button>
          </Box>
        ) : availability ? (
          <Box sx={{ pt: 2 }}>
            <Box hidden={tabIndex !== 0}>
              {loadingDays ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  sx={{ p: 4 }}
                >
                  <CircularProgress />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Cargando horario...
                  </Typography>
                </Box>
              ) : daysError ? (
                <Alert severity="error">{daysError}</Alert>
              ) : days.length === 0 ? (
                <Alert severity="warning" sx={{ m: 2 }}>
                  No se encontraron días configurados para este horario. Si el
                  error persiste, contacte a soporte.
                </Alert>
              ) : (
                <Stack spacing={2}>
                  {formattedDays.map((day) => (
                    <DayAvailabilityCard
                      key={day.dayOfWeek}
                      dayData={day}
                      onToggleDay={handleToggleDay}
                    />
                  ))}
                </Stack>
              )}
            </Box>
            <Box hidden={tabIndex !== 1}>
              <ExceptionsTab staffMemberId={staffMemberId} />
            </Box>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
});

AvailabilityDialog.displayName = "AvailabilityDialog";

// --- Modal de edición de OfferedService ---
function OfferedServiceEditDialog({ open, onClose, onSubmit, offeredService }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const firstFieldRef = useRef(null);

  const [form, setForm] = useState({
    customPrice: "",
    customDuration: "",
    customDescription: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && offeredService) {
      const suggestedPrice = offeredService.service?.suggestedPrice || 0;
      const suggestedDuration = offeredService.service?.suggestedDuration || 0;
      const serviceDescription = offeredService.service?.description || "";
      setForm({
        customPrice: offeredService.customPrice ?? suggestedPrice,
        customDuration: offeredService.customDuration ?? suggestedDuration,
        customDescription:
          offeredService.customDescription ?? serviceDescription,
      });
      setErrors({});
      setTimeout(() => firstFieldRef.current?.focus(), 50);
    }
  }, [open, offeredService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (form.customPrice === "" || Number(form.customPrice) <= 0)
      e.customPrice = "El precio debe ser mayor a 0";
    if (form.customDuration === "" || Number(form.customDuration) <= 0)
      e.customDuration = "La duración debe ser mayor a 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      customPrice: Number(form.customPrice),
      customDuration: Number(form.customDuration),
      customDescription: form.customDescription?.trim() || null,
    };
    onSubmit(payload);
  };

  const suggestedPrice = offeredService?.service?.suggestedPrice ?? 0;
  const suggestedDuration = offeredService?.service?.suggestedDuration ?? "-";
  const serviceDescription =
    offeredService?.service?.description || "Sin descripción";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
    >
      <DialogTitle>Editar servicio ofrecido</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            inputRef={firstFieldRef}
            label="Precio personalizado"
            name="customPrice"
            type="number"
            value={form.customPrice}
            onChange={handleChange}
            error={!!errors.customPrice}
            helperText={
              errors.customPrice ||
              `Precio sugerido: ${formatCurrency(suggestedPrice)}`
            }
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            label="Duración personalizada (minutos)"
            name="customDuration"
            type="number"
            value={form.customDuration}
            onChange={handleChange}
            error={!!errors.customDuration}
            helperText={
              errors.customDuration ||
              `Duración sugerida: ${suggestedDuration} min`
            }
            fullWidth
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Descripción personalizada"
            name="customDescription"
            value={form.customDescription}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            placeholder="Agrega detalles específicos sobre cómo ofreces este servicio (opcional)"
            helperText={`Descripción base: ${serviceDescription}`}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<EditIcon />}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// --- Tarjeta de servicio ofrecido ---
function OfferedServiceCard({ item, onEdit, onDelete }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const price = item.customPrice ?? item.service?.suggestedPrice ?? 0;
  const duration =
    item.customDuration ?? item.service?.suggestedDuration ?? "-";
  const description = item.customDescription || item.service?.description || "";
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(item);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(item);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        boxShadow: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: theme.shadows[4],
          transform: "translateY(-2px)",
        },
        position: "relative",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1,
          p: { xs: 2, sm: 3 },
          "&:last-child": { pb: { xs: 2, sm: 3 } },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            fontWeight={600}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              flex: 1,
              pr: 1,
              lineHeight: 1.3,
              minHeight: "3.2em",
            }}
          >
            {item.serviceName || item.service?.name || "Servicio sin nombre"}
          </Typography>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ ml: 1, flexShrink: 0 }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Editar</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Eliminar</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
        <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
          <Chip
            label={`${duration} min`}
            size="small"
            sx={{ backgroundColor: theme.palette.grey[100] }}
          />
          <Chip
            label={formatCurrency(price)}
            size="small"
            color="success"
            variant="outlined"
          />
        </Stack>
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              fontStyle: item.customDescription ? "normal" : "italic",
              flex: 1,
              minHeight: "4.5em",
            }}
          >
            {description}
          </Typography>
        )}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => onEdit(item)}
          sx={{ mt: "auto" }}
        >
          Editar servicio
        </Button>
      </CardContent>
    </Card>
  );
}

// --- Sección de empresa ---
function CompanySection({ company, onEdit, onDelete, staffMemberId }) {
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        mb: 3,
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          backgroundColor: theme.palette.primary.main,
          color: "white",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
        onClick={toggleExpand}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ flex: 1, minWidth: "250px" }}
        >
          <BusinessIcon />
          <Box flex={1}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight={700}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {company.companyName || "Empresa sin nombre"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {company.items.length} servicio
              {company.items.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setAvailabilityOpen(true)}
            startIcon={<DateRangeIcon />}
            sx={{
              backgroundColor: "white",
              color: "primary.main",
              "&:hover": { backgroundColor: "grey.100" },
            }}
          >
            Configurar disponibilidad
          </Button>
          {availabilityOpen && (
            <AvailabilityDialog
              open={availabilityOpen}
              onClose={() => setAvailabilityOpen(false)}
              staffMemberId={staffMemberId}
            />
          )}
          <IconButton
            onClick={toggleExpand}
            sx={{ color: "white" }}
            size="large"
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Stack>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {company.items.map((item) => {
              return (
                <Grid key={item.id} size={{ xs: 12, sm: 6 }} lg={4}>
                  <OfferedServiceCard
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
}

// --- Vista principal (REFACTORIZADA) ---
export default function JobView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { user } = useAuth();

  const { loadingStaff: loading } = useUserStaffMembers(user?.id);
  const {
    services: data,
    error,
    refetch,
    updateService,
    deleteService,
  } = useOfferedServices();

  const [successMessage, setSuccessMessage] = useState(null);
  const [query, setQuery] = useState("");

  const [editing, setEditing] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [actionError, setActionError] = useState(null);

  const handleRetry = () => {
    setActionError(null);
    refetch();
  };

  const groupedServices = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    const normalized = data.map((item) => {
      // Usar los campos que vienen del transform
      return {
        id: item.id,
        staffMemberId: item.staffMemberId,
        companyId: item.companyId,
        companyName: item.companyName || "Empresa sin nombre",
        service: item.service || {},
        serviceName: item.serviceName,
        serviceId: item.serviceId,
        customPrice: item.customPrice,
        customDuration: item.customDuration,
        customDescription: item.customDescription,
        createdAt: item.createdAt,
      };
    });

    const filtered = query.trim()
      ? normalized.filter((item) => {
          const searchTerm = query.toLowerCase();
          const serviceName = (
            item.serviceName ||
            item.service?.name ||
            ""
          ).toLowerCase();
          const companyName = (item.companyName || "").toLowerCase();
          return (
            serviceName.includes(searchTerm) || companyName.includes(searchTerm)
          );
        })
      : normalized;

    const grouped = new Map();
    filtered.forEach((item) => {
      const key = item.companyId;
      if (!grouped.has(key)) {
        grouped.set(key, {
          companyId: key,
          companyName: item.companyName || "Empresa sin nombre",
          items: [],
        });
      }
      grouped.get(key).items.push(item);
    });

    return Array.from(grouped.values())
      .sort((a, b) => a.companyName.localeCompare(b.companyName))
      .map((group) => ({
        ...group,
        items: group.items.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        ),
      }));
  }, [data, query]);

  const handleOpenEdit = (item) => {
    setEditing(item);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setEditing(null);
  };

  const handleSubmitEdit = async (payload) => {
    setActionError(null);
    // Usamos la función updateService del hook
    const result = await updateService(editing.id, payload);

    if (result.success) {
      setSuccessMessage("Servicio actualizado correctamente");
      handleCloseEdit();
    } else {
      setActionError(result.error);
    }
  };

  const handleDeleteService = (item) => {
    setServiceToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setActionError(null);
    // Usamos la función deleteService del hook
    const result = await deleteService(serviceToDelete.id);

    if (result.success) {
      setSuccessMessage("Servicio eliminado correctamente");
      setDeleteConfirmOpen(false);
      setServiceToDelete(null);
    } else {
      setActionError(result.error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setServiceToDelete(null);
  };

  const renderSkeletons = () => (
    <Stack spacing={3}>
      {Array.from({ length: 2 }).map((_, i) => (
        <Paper key={i} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Skeleton variant="rectangular" height={80} />
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {Array.from({ length: 3 }).map((_, j) => (
                <Grid key={j} size={{ xs: 12, sm: 6 }} lg={4}>
                  <Skeleton variant="rounded" height={200} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      ))}
    </Stack>
  );

  // Mostrar loading solo si estamos obteniendo los servicios.
  // Si falla la carga de staff, pero los servicios están, mostramos los servicios.
  const isLoading = loading;
  const displayError = error || actionError;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1400px",
        mx: "auto",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight={700}
            gutterBottom
          >
            Mis servicios ofrecidos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona todos los servicios que ofreces en diferentes empresas
          </Typography>
        </Box>
        <TextField
          placeholder="Buscar por servicio, empresa o personal..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size={isMobile ? "small" : "medium"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Actualizar">
                  <IconButton onClick={handleRetry} edge="end">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: { xs: "100%", md: 350 },
            backgroundColor: "background.paper",
          }}
        />
      </Stack>

      {displayError && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setActionError(null)}
            >
              Cerrar
            </Button>
          }
        >
          {displayError}
        </Alert>
      )}

      {isLoading ? (
        renderSkeletons()
      ) : groupedServices.length === 0 ? (
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <BusinessIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {query
              ? "No se encontraron servicios"
              : "No tienes servicios ofrecidos aún"}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {query
              ? "Intenta con otros términos de búsqueda"
              : "Cuando registres servicios en empresas, aparecerán aquí organizados por compañía"}
          </Typography>
          {query && (
            <Button
              variant="outlined"
              onClick={() => setQuery("")}
              sx={{ mt: 2 }}
            >
              Limpiar búsqueda
            </Button>
          )}
        </Paper>
      ) : (
        <Stack spacing={0}>
          {groupedServices.map((company) => (
            <CompanySection
              key={company.companyId}
              company={company}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteService}
              staffMemberId={company.items[0]?.staffMemberId}
            />
          ))}
        </Stack>
      )}

      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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

      <OfferedServiceEditDialog
        open={editOpen}
        onClose={handleCloseEdit}
        onSubmit={handleSubmitEdit}
        offeredService={editing}
      />

      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar el servicio{" "}
            <strong>"{serviceToDelete?.service?.name}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCancelDelete} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
