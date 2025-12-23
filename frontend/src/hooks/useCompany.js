import { useState, useEffect, useCallback } from 'react';
import CompanyAPI from '../services/companyAPI';

/**
 * Hook personalizado para manejar el estado y operaciones de una empresa
 * @param {string} companyId - ID de la empresa
 * @returns {Object} Estado y métodos de la empresa
 */
export const useCompany = (companyId) => {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);

  const fetchCompany = useCallback(async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await CompanyAPI.getCompany(companyId);
      setCompany(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al cargar la empresa');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const updateCompany = async (updateData) => {
    try {
      const updatedData = await CompanyAPI.updateCompany(companyId, updateData);
      setCompany(prevCompany => ({ ...prevCompany, ...updatedData }));
      return updatedData;
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Error al actualizar la empresa');
    }
  };

  return {
    loading,
    company,
    error,
    refetch: fetchCompany,
    updateCompany
  };
};