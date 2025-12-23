import { useState, useEffect, useCallback } from "react";
import { Box, Modal, TextField, Button, Typography, Stack, Alert } from "@mui/material";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
  parse,
  format,
  startOfWeek,
  getDay,
  addMinutes,
  setHours,
  setMinutes,
} from 'date-fns';
import { es } from 'date-fns/locale';
import axios from 'axios';

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
});

const eventStyleGetter = (event) => {
  let backgroundColor = "#cbd5e1";
  let borderColor = "#64748b";

  switch (event.status) {
    case 'PENDING':
      backgroundColor = "#fef9c3";
      borderColor = "#eab308";
      break;
    case 'CONFIRMED':
      backgroundColor = "#d1fae5";
      borderColor = "#10b981";
      break;
    case 'CANCELLED':
      backgroundColor = "#fee2e2";
      borderColor = "#ef4444";
      break;
    case 'PAID':
      backgroundColor = "#e0f2fe";
      borderColor = "#3b82f6";
      break;
  }

  return {
    style: {
      backgroundColor,
      borderLeft: `4px solid ${borderColor}`,
      color: "#111827",
      borderRadius: "4px",
      padding: "2px 4px",
      fontSize: "0.75rem",
      lineHeight: "1.1",
      overflow: "hidden",
    },
  };
};

function CustomDayHeader({ date }) {
  const dayName = format(date, 'EEEE', { locale: es });
  const dayNumber = format(date, 'd', { locale: es });

  return (
    <Box sx={{ textAlign: 'left', lineHeight: 1.2 }}>
      <Box sx={{ fontSize: { xs: '0.625rem', md: '0.8rem' }, color: 'gray' }}>{dayName}</Box>
      <Box sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', md: '1rem' } }}>{dayNumber}</Box>
    </Box>
  );
}

export default function CalendarView() {
  const minTime = setMinutes(setHours(new Date(), 8), 0);
  const maxTime = setMinutes(setHours(new Date(), 18), 0);

  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('week');

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [paymentAmount, setPaymentAmount] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // -----------------------
  // Helper: trae pagos de un turno
  // -----------------------
  const fetchPaymentsForAppointment = useCallback(async (appointmentId) => {
    try {
      const res = await axios.get(`http://localhost:3000/payments/${appointmentId}`, {
        withCredentials: true
      });
      return res.data.map(p => ({
        id: p.id,
        amount: Number(p.amount),
        date: p.paymentDate ? new Date(p.paymentDate) : (p.createdAt ? new Date(p.createdAt) : new Date())
      }));
    } catch (err) {
      if (err.response && err.response.status === 404) return [];
      console.error(`Error fetching payments for appointment ${appointmentId}:`, err);
      return [];
    }
  }, []);

  // -----------------------
  // Actualizar estado en backend
  // -----------------------
  const updateAppointmentStatus = useCallback(async (appointmentId, status) => {
    try {
      await axios.patch(
        `http://localhost:3000/appointments/${appointmentId}/status`,
        { name: status },
        { withCredentials: true }
      );
      return true;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      return false;
    }
  }, []);

  // -----------------------
  // Actualizar fechas en backend
  // -----------------------
  const updateAppointmentDates = useCallback(async (appointmentId, start, end) => {
    try {
      await axios.patch(
        `http://localhost:3000/appointments/${appointmentId}`,
        {
          appointmentDateTime: start,
          duration: (end - start) / (1000 * 60) // duración en minutos
        },
        { withCredentials: true }
      );
      return true;
    } catch (error) {
      console.error('Error updating appointment dates:', error);
      return false;
    }
  }, []);

  // -----------------------
  // Traer appointments sin pagos (los pagos se cargan al abrir el modal)
  // -----------------------
  const fetchAppointments = useCallback(async () => {
    try {
      // 1. Obtener appointments
      const response = await axios.get('http://localhost:3000/appointments/me', {
        withCredentials: true
      });

      const appointments = response.data;

      // 2. Para cada appointment, obtener sus pagos
      const appointmentsWithPayments = await Promise.all(
        appointments.map(async appt => {
          const payments = await fetchPaymentsForAppointment(appt.id);
          return { ...appt, payments };
        })
      );

      // 3. Mapear a eventos para el calendario
      const events = appointmentsWithPayments.map(appt => {
        const price = appt.offered_service?.customPrice || 0;
        const duration = appt.offered_service?.customDuration || 60;
        const totalPaid = appt.payments.reduce((sum, p) => sum + Number(p.amount), 0);
        
        // Determinar estado basado en pagos
        const originalStatus = appt.status?.name || 'CONFIRMED';
        let status = originalStatus;
        if (totalPaid >= price) {
          status = 'PAID';
        } else if (totalPaid === 0) {
          status = 'PENDING';
        } else if (totalPaid > 0) {
          status = 'CONFIRMED';
        }

        return {
          raw: appt,
          id: appt.id,
          title: 'Turno reservado',
          start: new Date(appt.appointmentDateTime),
          end: addMinutes(new Date(appt.appointmentDateTime), duration),
          status,
          price,
          totalPaid,
          payments: appt.payments,
          professionalName: appt.offered_service?.staff_member?.professional?.user
            ? `${appt.offered_service.staff_member.professional.user.firstName} ${appt.offered_service.staff_member.professional.user.lastName}`
            : 'Desconocido',
          clientName: appt.client
            ? `${appt.client.firstName} ${appt.client.lastName}`
            : 'Cliente no disponible',
          companyName: appt.offered_service?.staff_member?.company?.name || 'Sin empresa',
          companyLocation: appt.offered_service?.staff_member?.company?.location || 'Ubicación no disponible',
        };
      });

      setEvents(events);
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    }
  }, [fetchPaymentsForAppointment]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);


  // -----------------------
  // Actualiza los pagos de un appointment y su estado
  // -----------------------
  const updateEventPayments = useCallback(async (appointmentId, payments) => {
    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    
    // Encontrar el evento actual
    const currentEvent = events.find(e => e.id === appointmentId);
    if (!currentEvent) return;

    // Determinar nuevo estado
    let newStatus = currentEvent.raw.status?.name || 'CONFIRMED';
    if (totalPaid >= currentEvent.price) {
      newStatus = 'PAID';
    } else if (totalPaid > 0) {
      newStatus = 'CONFIRMED';
    }

    // Actualizar estado en backend si cambió
    if (newStatus !== currentEvent.status) {
      await updateAppointmentStatus(appointmentId, newStatus);
    }

    // Actualizar estado local
    setEvents(prev => prev.map(ev => {
      if (ev.id !== appointmentId) return ev;
      return { ...ev, payments, totalPaid, status: newStatus };
    }));

    // Actualizar selectedEvent si corresponde
    setSelectedEvent(prev => {
      if (!prev || prev.id !== appointmentId) return prev;
      return { ...prev, payments, totalPaid, status: newStatus };
    });
  }, [events, updateAppointmentStatus]);


  // -----------------------
  // Añadir pago
  // -----------------------
  const handleAddPayment = async (appointmentId, amount) => {
    if (!amount || Number(amount) <= 0) return;
    setIsProcessingPayment(true);
    try {
      const amountNumber = Number(amount);
      await axios.post(
        `http://localhost:3000/payments/${appointmentId}`,
        { amount: amountNumber },
        { withCredentials: true }
      );

      // Traer pagos actualizados
      const payments = await fetchPaymentsForAppointment(appointmentId);
      await updateEventPayments(appointmentId, payments);

      setPaymentAmount('');
    } catch (err) {
      console.error('Error al abonar:', err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // -----------------------
  // Eliminar último pago
  // -----------------------
  const handleRemoveLastPayment = async (appointmentId) => {
    if (!window.confirm('¿Estás seguro de eliminar el último pago?')) return;

    setIsProcessingPayment(true);
    try {
      await axios.delete(
        `http://localhost:3000/payments/${appointmentId}`,
        { withCredentials: true }
      );

      // Actualizar con los pagos restantes
      const updatedPayments = await fetchPaymentsForAppointment(appointmentId);
      await updateEventPayments(appointmentId, updatedPayments);
    } catch (err) {
      console.error('Error al eliminar pago:', err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSelectEvent = (event) => {
    // Ya no necesitamos cargar los pagos aquí porque se cargan al inicio
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleEventResize = async ({ event, start, end }) => {
    const success = await updateAppointmentDates(event.id, start, end);
    if (success) {
      setEvents(prev => prev.map(e =>
        e.id === event.id ? { ...e, start, end } : e
      ));
    } else {
      // Revertir cambios si falla la actualización en backend
      fetchAppointments();
    }
  };

  const handleEventDrop = async ({ event, start, end }) => {
    const success = await updateAppointmentDates(event.id, start, end);
    if (success) {
      setEvents(prev => prev.map(e =>
        e.id === event.id ? { ...e, start, end } : e
      ));
    } else {
      // Revertir cambios si falla la actualización en backend
      fetchAppointments();
    }
  };

  // -----------------------
  // Render
  // -----------------------
  return (
    <Box
      sx={{
        height: 'calc(100vh - 2rem)',
        width: '100%',
        '& .rbc-calendar': { height: '100%' },
        '& .rbc-event': {
          borderLeft: '4px solid #0EA5E9',
          backgroundColor: '#0EA5E9',
          borderRadius: '4px',
          border: 'none',
        },
        '& .rbc-selected': { backgroundColor: '#1565c0' },
        '& .rbc-today': { backgroundColor: '#e3f2fd' }
      }}
    >
      <Calendar
        culture="es"
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        style={{ height: '100%' }}

        selectable
        resizable
        draggableAccessor={() => true}

        onSelectEvent={handleSelectEvent}
        onEventResize={handleEventResize}
        onEventDrop={handleEventDrop}

        step={30}
        showMultiDayTimes
        date={date}
        onNavigate={setDate}
        view={view}
        onView={setView}

        min={minTime}
        max={maxTime}
        eventPropGetter={eventStyleGetter}
        components={{
          header: CustomDayHeader
        }}
        formats={{
          dayRangeHeaderFormat: ({ start, end }) =>
            `${format(start, "d 'de' MMMM", { locale: es })} – ${format(end, "d 'de' MMMM", { locale: es })}`,
          agendaDateFormat: (date) => format(date, 'EEEE d MMMM', { locale: es }),
          agendaTimeFormat: (date) => format(date, 'HH:mm', { locale: es }),
          timeGutterFormat: (date) => format(date, 'HH:mm', { locale: es }),
          monthHeaderFormat: (date) => format(date, "MMMM yyyy", { locale: es }),
        }}
        messages={{
          allDay: 'Todo el día',
          previous: 'Anterior',
          next: 'Siguiente',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'No hay eventos en este rango',
          showMore: total => `Ver más (${total})`,
        }}
      />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="detalles-turno-modal"
      >
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
          <Typography id="detalles-turno-modal" variant="h6" component="h2" gutterBottom>
            Detalles del Turno
          </Typography>

          {selectedEvent && (
            <Stack spacing={2} mt={2}>
              <Typography variant="body2"><strong>Título:</strong> {selectedEvent.title}</Typography>
              <Typography variant="body2"><strong>Estado:</strong> {selectedEvent.status}</Typography>
              <Typography variant="body2"><strong>Inicio:</strong> {format(selectedEvent.start, 'PPpp', { locale: es })}</Typography>
              <Typography variant="body2"><strong>Fin:</strong> {format(selectedEvent.end, 'PPpp', { locale: es })}</Typography>
              <Typography variant="body2"><strong>Profesional:</strong> {selectedEvent.professionalName}</Typography>
              <Typography variant="body2"><strong>Cliente:</strong> {selectedEvent.clientName}</Typography>
              <Typography variant="body2"><strong>Empresa:</strong> {selectedEvent.companyName}</Typography>
              <Typography variant="body2"><strong>Ubicación:</strong> {selectedEvent.companyLocation}</Typography>
              
              <Typography variant="body2"><strong>Precio:</strong> ${selectedEvent.price || 0}</Typography>
              <Typography variant="body2"><strong>Abonado:</strong> ${selectedEvent.totalPaid || 0}</Typography>
              <Typography variant="body2">
                <strong>Saldo pendiente:</strong> ${Math.max(0, (selectedEvent.price || 0) - (selectedEvent.totalPaid || 0))}
              </Typography>

              {/* Lista de pagos persistentes */}
              <Box>
                <Typography variant="subtitle2">Pagos realizados:</Typography>
                {selectedEvent.payments && selectedEvent.payments.length > 0 ? (
                  <Box sx={{ maxHeight: 160, overflowY: 'auto', mt: 1 }}>
                    {selectedEvent.payments.map(payment => (
                      <Box key={payment.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                        <Typography variant="body2">{format(payment.date, 'dd/MM/yyyy HH:mm')}</Typography>
                        <Typography variant="body2" fontWeight="bold">${payment.amount}</Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">No hay pagos registrados.</Typography>
                )}
              </Box>

              {/* Input y botón de abono */}
              {(selectedEvent.totalPaid || 0) < (selectedEvent.price || 0) && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    type="number"
                    label="Monto a abonar"
                    variant="outlined"
                    size="small"
                    fullWidth
                    inputProps={{ 
                      min: 1,
                      max: (selectedEvent.price || 0) - (selectedEvent.totalPaid || 0),
                      step: 100
                    }}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    disabled={isProcessingPayment}
                  />
                  <Button
                    onClick={() => handleAddPayment(selectedEvent.id, paymentAmount)}
                    variant="contained"
                    color="primary"
                    disabled={!paymentAmount || Number(paymentAmount) <= 0 || isProcessingPayment}
                    sx={{ minWidth: 100 }}
                  >
                    {isProcessingPayment ? 'Procesando...' : 'Abonar'}
                  </Button>
                </Stack>
              )}

              {(selectedEvent.payments && selectedEvent.payments.length > 0) && (
                <Button
                  onClick={() => handleRemoveLastPayment(selectedEvent.id)}
                  variant="outlined"
                  color="error"
                  fullWidth
                  sx={{ mt: 1 }}
                  disabled={isProcessingPayment}
                >
                  Cancelar último abono
                </Button>
              )}

              {(selectedEvent.totalPaid || 0) >= (selectedEvent.price || 0) && (
                <Alert severity="success" sx={{ mt: 2 }}>¡Turno pagado!</Alert>
              )}

              <Button 
                onClick={() => setIsModalOpen(false)} 
                variant="text" 
                fullWidth
                sx={{ mt: 2 }}
              >
                Cerrar
              </Button>
            </Stack>
          )}
        </Box>
      </Modal>
    </Box>
  );
}