// src/hooks/useAllCompanies.js
import { useState, useEffect, useCallback } from 'react';
import CompanyAPI from '../services/companyAPI';

/**
 * Hook para manejar la lista de TODAS las empresas disponibles.
 * Diseñado para la vista pública o de exploración.
 * @returns {Object} Estado y datos de todas las empresas.
 */
export const useAllCompanies = () => {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);

  const fetchAllCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // ⬅️ Llama a la nueva función de la API
      const data = await CompanyAPI.getAllCompanies();
      setCompanies(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error cargando las empresas disponibles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);

  return {
    loading,
    companies,
    error,
    refetch: fetchAllCompanies,
  };
};