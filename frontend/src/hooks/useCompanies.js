import { useState, useEffect, useCallback } from 'react';
import CompanyAPI from '../services/companyAPI';

/**
 * Hook para manejar la lista de empresas del usuario
 * @returns {Object} Estado y métodos para las empresas
 */
export const useCompanies = () => {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CompanyAPI.getMyCompanies();
      setCompanies(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error cargando tus empresas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const createCompany = async (name) => {
    try {
      const newCompany = await CompanyAPI.createCompany(name)
      setCompanies(prevCompanies => [...prevCompanies, newCompany]);
      return newCompany;
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'No se pudo crear la empresa');
    }
  };

  return {
    loading,
    companies,
    error,
    refetch: fetchCompanies,
    createCompany
  };
};