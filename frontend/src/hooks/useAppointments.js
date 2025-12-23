import { useState, useEffect, useCallback } from 'react';
import AppointmentAPI from '../services/appointmentAPI';

export const useAppointments = (staffMemberId, date) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener citas para un staff member y fecha específica
  const fetchAppointments = useCallback(async () => {
    if (!staffMemberId || !date) {
      setAppointments([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const formattedDate = date.toISOString().split('T')[0];
      
      const appointmentsData = await AppointmentAPI.getAppointmentsByStaffAndDate(
        staffMemberId, 
        formattedDate
      );
      
      setAppointments(appointmentsData);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [staffMemberId, date]);

  // Efecto para cargar citas
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  /**
   * Buscar citas por email y compañía (NUEVA FUNCIÓN)
   */
  const searchAppointmentsByEmailAndCompany = useCallback(async (email, companyId, status = 'pending') => {
    setLoading(true);
    setError(null);

    try {
      if (!email || !companyId) {
        throw new Error('Email y ID de compañía son requeridos');
      }

      const appointmentsData = await AppointmentAPI.getAppointmentsByEmailAndCompany(
        email,
        companyId,
        status
      );
      
      setAppointments(appointmentsData);
      return appointmentsData;
    } catch (err) {
      console.error('Error searching appointments by email and company:', err);
      
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Error al buscar las reservas';
      setError(errorMessage);
      setAppointments([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crea una nueva cita
   */
  const createAppointment = async (appointmentData) => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await AppointmentAPI.createAppointment(appointmentData);
      
      // Actualizar lista después de crear
      if (staffMemberId && date) {
        await fetchAppointments();
      }
      
      return response;
    } catch (err) {
      console.error('Error creating appointment:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Error al crear la reserva';
      setError(errorMessage);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Cancela una cita
   */
  const cancelAppointment = async (appointmentId) => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await AppointmentAPI.cancelAppointment(appointmentId);
      
      // Actualizar lista después de cancelar
      if (staffMemberId && date) {
        await fetchAppointments();
      }
      
      return response;
    } catch (err) {
      console.error('Error canceling appointment:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Error al cancelar la reserva';
      setError(errorMessage);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Obtiene una cita por ID
   */
  const getAppointmentById = async (appointmentId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AppointmentAPI.getAppointment(appointmentId);
      return response;
    } catch (err) {
      console.error('Error fetching appointment:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Error al obtener la cita';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza una cita
   */
  const updateAppointment = async (appointmentId, updateData) => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await AppointmentAPI.updateAppointment(appointmentId, updateData);
      
      // Actualizar lista
      if (staffMemberId && date) {
        await fetchAppointments();
      }
      
      return response;
    } catch (err) {
      console.error('Error updating appointment:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Error al actualizar la cita';
      setError(errorMessage);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Función para refetch manual
  const refetch = useCallback(() => {
    if (staffMemberId && date) {
      fetchAppointments();
    }
  }, [fetchAppointments, staffMemberId, date]);

  return {
    // Estado
    appointments,
    loading: loading || actionLoading,
    error,
    
    // Acciones
    createAppointment,
    cancelAppointment,
    getAppointmentById,
    updateAppointment,
    searchAppointmentsByEmailAndCompany, // Nueva función añadida
    refetch,
    
    // Helpers
    hasAppointments: appointments.length > 0,
    clearError: () => setError(null)
  };
};