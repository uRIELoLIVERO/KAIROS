// hooks/useAvailability.js
import { useState, useEffect, useCallback } from 'react';
import AvailabilityAPI from '../services/availabilityAPI';
import TimeSlotAPI from '../services/timeSlotAPI';

/**
 * Hook para manejar la disponibilidad de un miembro del personal
 * @param {string} staffMemberId - ID del miembro del personal
 * @returns {Object} Estado y métodos de la disponibilidad
 */
export const useAvailability = (staffMemberId) => {
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState(null);
  const [error, setError] = useState(null);

  const fetchAvailability = useCallback(async () => {
    if (!staffMemberId) {
      setLoading(false);
      setAvailability(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 1. Obtener disponibilidad base
      const data = await AvailabilityAPI.getByStaffMember(staffMemberId);
      
      if (data) {
        // 2. Obtener todos los time slots para cada día
        let allTimeSlots = [];
        
        if (data.availability_days && data.availability_days.length > 0) {
          // Obtener slots para cada día
          const slotsPromises = data.availability_days.map(async (day) => {
            try {
              const slots = await TimeSlotAPI.getByDay(day.id);
              return slots.map(slot => ({
                ...slot,
                dayOfWeek: day.dayOfWeek // Añadir el día de la semana
              }));
            } catch (err) {
              console.error(`Error obteniendo slots para día ${day.id}:`, err);
              return [];
            }
          });
          
          const slotsArrays = await Promise.all(slotsPromises);
          allTimeSlots = slotsArrays.flat();
        }
        
        // Estructura consistente con lo que espera ReservationWizard
        setAvailability({
          ...data,
          availability_days: data.availability_days || [],
          timeSlots: allTimeSlots, // Añadimos los time slots obtenidos
          availableDays: (data.availability_days || [])
            .filter(day => day.isEnabled)
            .map(day => day.dayOfWeek),
          staffMemberId: data.staffMemberId || staffMemberId
        });
      } else {
        // No existe disponibilidad para este staff member
        setAvailability({
          availability_days: [],
          timeSlots: [],
          availableDays: [],
          staffMemberId: staffMemberId,
          exists: false
        });
        setError(null);
      }
      
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError(err?.response?.data?.message || err.message || 'Error al cargar la disponibilidad');
      setAvailability(null);
    } finally {
      setLoading(false);
    }
  }, [staffMemberId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  /**
   * Crea una nueva disponibilidad
   * @param {Object} availabilityData - Datos para crear la disponibilidad
   */
  const createAvailability = async (availabilityData) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await AvailabilityAPI.create(availabilityData);
      
      // Actualizamos el estado con los datos recibidos
      setAvailability({
        ...data,
        availableDays: data.availableDays || [],
        timeSlots: data.timeSlots || [],
        exists: true
      });
      
      return data;
    } catch (err) {
      console.error('Error creating availability:', err);
      const errorMessage = err?.response?.data?.message || err.message || 'Error al crear la disponibilidad';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza la disponibilidad existente
   * @param {Object} updateData - Datos a actualizar
   */
  const updateAvailability = async (updateData) => {
    if (!availability?.id) {
      throw new Error('No hay disponibilidad para actualizar');
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await AvailabilityAPI.update(availability.id, updateData);
      
      // Actualizamos el estado con los datos recibidos
      setAvailability(prev => ({
        ...prev,
        ...data,
        availableDays: data.availableDays || prev.availableDays || [],
        timeSlots: data.timeSlots || prev.timeSlots || []
      }));
      
      return data;
    } catch (err) {
      console.error('Error updating availability:', err);
      const errorMessage = err?.response?.data?.message || err.message || 'Error al actualizar la disponibilidad';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Agrega un time slot a la disponibilidad actual
   * @param {Object} timeSlotData - Datos del time slot
   */
  const addTimeSlot = async (timeSlotData) => {
    if (!availability?.id) {
      // Si no existe disponibilidad, primero la creamos
      const newAvailability = await createAvailability({
        staffMemberId: staffMemberId,
        availableDays: [timeSlotData.day],
        timeSlots: [timeSlotData]
      });
      return newAvailability;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await AvailabilityAPI.addTimeSlot(availability.id, timeSlotData);
      
      // Actualizamos el estado
      setAvailability(prev => ({
        ...prev,
        availableDays: data.availableDays || [...new Set([...prev.availableDays, timeSlotData.day])],
        timeSlots: data.timeSlots || [...prev.timeSlots, timeSlotData]
      }));
      
      return data;
    } catch (err) {
      console.error('Error adding time slot:', err);
      const errorMessage = err?.response?.data?.message || err.message || 'Error al agregar el horario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina un time slot
   * @param {string} timeSlotId - ID del time slot a eliminar
   */
  const removeTimeSlot = async (timeSlotId) => {
    if (!availability?.id) {
      throw new Error('No hay disponibilidad para modificar');
    }

    try {
      setLoading(true);
      setError(null);
      
      await AvailabilityAPI.removeTimeSlot(availability.id, timeSlotId);
      
      // Actualizamos el estado localmente
      setAvailability(prev => {
        const updatedTimeSlots = prev.timeSlots.filter(slot => slot.id !== timeSlotId);
        
        // Recalculamos los días disponibles basados en los slots restantes
        const remainingDays = [...new Set(
          updatedTimeSlots.map(slot => slot.day)
        )];
        
        return {
          ...prev,
          availableDays: remainingDays,
          timeSlots: updatedTimeSlots
        };
      });
      
    } catch (err) {
      console.error('Error removing time slot:', err);
      const errorMessage = err?.response?.data?.message || err.message || 'Error al eliminar el horario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    availability,
    error,
    refetch: fetchAvailability,
    createAvailability,
    updateAvailability,
    addTimeSlot,
    removeTimeSlot,
    hasAvailability: availability?.timeSlots?.length > 0,
    isAvailableOnDay: (day) => availability?.availableDays?.includes(day) || false
  };
};