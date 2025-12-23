import { useState, useCallback, useEffect } from "react";
import OfferedServiceAPI from "../services/offeredServiceAPI";

export const useOfferedServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchServices = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await OfferedServiceAPI.getMyOfferedServices();
            const data = Array.isArray(response) ? response : response?.data || [];
            
            setServices(data);
        } catch (err) {
            console.error("Error al cargar servicios ofrecidos:", err);
            setError(err.response?.data?.message || "Error de conexión al cargar servicios");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const updateService = async (id, payload) => {
        try {
            await OfferedServiceAPI.updateOfferedService(id, payload);
            await fetchServices();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || "Error al actualizar" };
        }
    };

    const deleteService = async (id) => {
        try {
            await OfferedServiceAPI.deleteOfferedService(id);
            await fetchServices();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || "Error al eliminar" };
        }
    };

    return {
        services,
        loading,
        error,
        refetch: fetchServices,
        updateService,
        deleteService
    };
};