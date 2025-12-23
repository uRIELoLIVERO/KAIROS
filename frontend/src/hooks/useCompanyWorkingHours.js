import { useState, useCallback } from 'react';
import CompanyWorkingHoursAPI from '../services/companyWorkingHoursAPI';

/**
 * Hook para gestionar los horarios de atención
 */
export const useCompanyWorkingHours = () => {
  const [loading, setLoading] = useState(false);
  const [workingHours, setWorkingHours] = useState([]);
  const [error, setError] = useState(null);

  // --- OBTENER TODOS (General) ---
  const fetchAllWorkingHours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CompanyWorkingHoursAPI.getAll();
      setWorkingHours(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error cargando horarios');
    } finally {
      setLoading(false);
    }
  }, []);

  // --- OBTENER POR EMPRESA (Filtrado en cliente) ---
  // Nota: Idealmente tu backend debería tener un endpoint GET /?companyId=X para esto.
  // Por ahora, traemos todos y filtramos aquí.
  const fetchHoursByCompany = useCallback(async (companyId) => {
    try {
setLoading(true);
      // 1. Obtener respuesta
      const response = await CompanyWorkingHoursAPI.getAll();
      
      // 2. Extracción Segura: Determinamos dónde está el array
      let allHours = [];
      
      if (Array.isArray(response)) {
          // Caso A: La respuesta es directamente el array [ {..}, {..} ]
          allHours = response;
      } else if (response && Array.isArray(response.data)) {
          // Caso B: La respuesta es un objeto tipo axios { data: [..] } o backend { data: [..] }
          allHours = response.data;
      } else if (response && typeof response === 'object') {
          // Caso C: Intento desesperado de encontrar un array en las propiedades
          const possibleArray = Object.values(response).find(val => Array.isArray(val));
          if (possibleArray) allHours = possibleArray;
      }

      // 3. Validación final antes de filtrar
      if (!Array.isArray(allHours)) {
          console.warn("useCompanyWorkingHours: La respuesta no contiene un listado de horarios válido.", response);
          allHours = []; // Fallback para evitar el crash .filter is not a function
      }
      
      // 4. Filtrado Robusto
      const companyHours = allHours.filter(h => {
        // Soporte para camelCase y snake_case
        const resourceCompanyId = h.companyId || h.company_id;
        return String(resourceCompanyId) === String(companyId);
      });

      setWorkingHours(companyHours);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error cargando horarios de la empresa');
    } finally {
      setLoading(false);
    }
  }, []);

  // --- CREAR ---
  const createWorkingHour = async (data) => {
    try {
      setLoading(true);
      const newHour = await CompanyWorkingHoursAPI.create(data);
      // Actualizamos el estado local agregando el nuevo registro
      setWorkingHours(prev => [...prev, newHour]);
      return { success: true, data: newHour };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al crear horario';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // --- ACTUALIZAR ---
  const updateWorkingHour = async (id, data) => {
    try {
      setLoading(true);
      const updatedHour = await CompanyWorkingHoursAPI.update(id, data);
      
      // Actualizamos el estado local reemplazando el registro modificado
      setWorkingHours(prev => 
        prev.map(item => item.id === id ? updatedHour : item)
      );
      return { success: true, data: updatedHour };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al actualizar horario';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // --- ELIMINAR ---
  const deleteWorkingHour = async (id) => {
    try {
      setLoading(true);
      await CompanyWorkingHoursAPI.delete(id);
      
      // Actualizamos el estado local removiendo el registro
      setWorkingHours(prev => prev.filter(item => item.id !== id));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al eliminar horario';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    workingHours,
    loading,
    error,
    fetchAllWorkingHours,
    fetchHoursByCompany, 
    createWorkingHour,
    updateWorkingHour,
    deleteWorkingHour
  };
};