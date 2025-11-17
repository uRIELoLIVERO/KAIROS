// hooks/useAvailabilityDays.js
import { useState, useEffect, useCallback, useRef } from 'react';
import AvailabilityDayAPI from '../services/availabilityDayAPI';

export const useAvailabilityDays = (availabilityId) => {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const cache = useRef(new Map()); 

  const fetchDays = useCallback(async () => {
    if (!availabilityId) {
      setDays([]);
      return;
    }

    // Verificar cache
    if (cache.current.has(availabilityId)) {
      setDays(cache.current.get(availabilityId));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await AvailabilityDayAPI.getByAvailability(availabilityId);
      const daysData = response || [];
      
      // Guardar en cache
      cache.current.set(availabilityId, daysData);
      setDays(daysData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [availabilityId]);

  useEffect(() => {
    fetchDays();
  }, [fetchDays]);

  const updateDay = useCallback(async (dayId, updates) => {
    try {
      const response = await AvailabilityDayAPI.update(dayId, updates);
      
      // Actualizar estado local y cache
      setDays(prev => {
        const updatedDays = prev.map(day => 
          day.id === dayId ? { ...day, ...response } : day
        );
        
        // Actualizar cache
        if (availabilityId) {
          cache.current.set(availabilityId, updatedDays);
        }
        
        return updatedDays;
      });
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [availabilityId]);

  const createAvailabilityDay = useCallback(async () => {
    if (!availabilityId) return null;
    
    try {
      const response = await AvailabilityDayAPI.createAvailabilityDay(availabilityId);
      const daysData = response || [];
      
      // Actualizar cache
      cache.current.set(availabilityId, daysData);
      setDays(daysData);
      
      return daysData;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [availabilityId]);

  const refetch = useCallback(() => {
    if (availabilityId) {
      cache.current.delete(availabilityId);
    }
    fetchDays();
  }, [availabilityId, fetchDays]);

  return {
    days,
    loading,
    error,
    updateDay,
    createAvailabilityDay,
    refetch
  };
};