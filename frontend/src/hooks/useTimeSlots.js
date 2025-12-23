import { useState, useEffect, useCallback } from 'react';
import TimeSlotAPI from '../services/timeSlotAPI';

/**
 * Hook para manejar los turnos (time slots) de un día
 * @param {string} dayId - ID del día de disponibilidad
 * @returns {Object} Estado y métodos de los turnos
 */
export const useTimeSlots = (dayId) => {
  const [loading, setLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState([]);
  const [error, setError] = useState(null);

  const fetchTimeSlots = useCallback(async () => {
    if (!dayId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await TimeSlotAPI.getByDay(dayId);
      setTimeSlots(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al cargar los turnos');
    } finally {
      setLoading(false);
    }
  }, [dayId]);

  useEffect(() => {
    fetchTimeSlots();
  }, [fetchTimeSlots]);

  /**
   * Crea un nuevo turno y lo añade al estado
   * @param {Object} slotData - { startTime, endTime }
   */
  const createTimeSlot = async (slotData) => {
    if (!dayId) throw new Error("ID del día no proporcionado");
    
    try {
      const payload = { ...slotData, availabilityDayId: dayId };
      const newSlot = await TimeSlotAPI.create(payload);
      setTimeSlots(prevSlots => [...prevSlots, newSlot].sort((a,b) => a.startTime.localeCompare(b.startTime)));
      return newSlot;
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Error al crear el turno');
    }
  };

  /**
   * Elimina un turno del estado
   * @param {string} timeSlotId - ID del turno a eliminar
   */
  const deleteTimeSlot = async (timeSlotId) => {
    try {
      await TimeSlotAPI.delete(timeSlotId);
      setTimeSlots(prevSlots => prevSlots.filter(slot => slot.id !== timeSlotId));
    } catch (err) {
      console.error("Error en el hook al eliminar slot:", err);
      throw new Error(err?.response?.data?.message || 'Error al eliminar el turno');
    }
  };

  return {
    loading,
    timeSlots,
    setTimeSlots,
    error,
    refetch: fetchTimeSlots,
    createTimeSlot,
    deleteTimeSlot
  };
};