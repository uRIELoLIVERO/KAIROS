import { useState, useEffect, useCallback } from 'react';
import AvailabilityExceptionAPI from '../services/availabilityExceptionAPI';

/**
 * Hook para manejar las excepciones de disponibilidad de un staff member
 * @param {string} staffMemberId - ID del miembro del personal
 * @returns {Object} Estado y métodos de las excepciones
 */
export const useAvailabilityExceptions = (staffMemberId) => {
  const [loading, setLoading] = useState(true);
  const [exceptions, setExceptions] = useState([]);
  const [error, setError] = useState(null);

  const fetchExceptions = useCallback(async () => {
    if (!staffMemberId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await AvailabilityExceptionAPI.getByStaffMember(staffMemberId);
      setExceptions(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al cargar las excepciones');
    } finally {
      setLoading(false);
    }
  }, [staffMemberId]);

  useEffect(() => {
    fetchExceptions();
  }, [fetchExceptions]);

  /**
   * Crea una nueva excepción y la añade al estado
   * @param {Object} exceptionData 
   */
  const createException = async (exceptionData) => {
    if (!staffMemberId) throw new Error("ID del staff member no proporcionado");
    
    try {
      const payload = { ...exceptionData, staffMemberId: staffMemberId };
      const newException = await AvailabilityExceptionAPI.create(payload);
      setExceptions(prevExceptions => [...prevExceptions, newException]);
      return newException;
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Error al crear la excepción');
    }
  };

  /**
   * Elimina una excepción del estado
   * @param {string} exceptionId - ID de la excepción a eliminar
   */
  const deleteException = async (exceptionId) => {
    try {
      await AvailabilityExceptionAPI.delete(exceptionId);
      setExceptions(prevExceptions => prevExceptions.filter(ex => ex.id !== exceptionId));
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Error al eliminar la excepción');
    }
  };

  return {
    loading,
    exceptions,
    error,
    refetch: fetchExceptions,
    createException,
    deleteException
  };
};