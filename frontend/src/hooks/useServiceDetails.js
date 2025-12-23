import { useState, useCallback, useEffect } from "react";
import OfferedServiceAPI from "../services/offeredServiceAPI";

export const useServiceDetails = (serviceId) => {
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchService = useCallback(async (id) => {
        if (!id) {
            setLoading(false);
            setService(null);
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            const response = await OfferedServiceAPI.getServiceById(id);
            setService(response.data || response);
        } catch (err) {
            console.error("Error fetching service:", err);
            setError(err.message || "Error al cargar el servicio");
            setService(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchService(serviceId);
    }, [serviceId, fetchService]);

    return { service, loading, error, refetch: () => fetchService(serviceId) };
};