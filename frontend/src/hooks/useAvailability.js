import { useState, useEffect, useCallback } from 'react';
import AvailabilityAPI from '../services/availabilityAPI';

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
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await AvailabilityAPI.getByStaffMember(staffMemberId);
      if (data) {
          setAvailability(data);
      } else {
        setAvailability(null);
        setError('No se encontró disponibilidad para este miembro del personal');
      }
      
    } catch (err) {
      // Si no se encuentra (404), podría no ser un "error" sino que hay que crearla.
      // Pero por ahora, seguimos el patrón de error.
      setError(err?.response?.data?.message || 'Error al cargar la disponibilidad');
      setAvailability(null); // Asegurarse de que no haya datos antiguos
    } finally {
      setLoading(false);
    }
  }, [staffMemberId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  /**
   * Intenta crear una disponibilidad
   * @param {Object} data - Datos para la nueva disponibilidad
   */
  const createAvailability = async (data) => {
    try {
      const newData = await AvailabilityAPI.create(data);
      setAvailability(newData);
      setError(null);
      return newData;
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al crear la disponibilidad');
      throw err;
    }
  };

  return {
    loading,
    availability,
    error,
    refetch: fetchAvailability,
    createAvailability
  };
};