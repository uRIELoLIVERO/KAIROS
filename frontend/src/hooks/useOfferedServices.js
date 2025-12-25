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
            const response = await OfferedServiceAPI.updateOfferedService(id, payload);
            
            if (response && response.data) {
                
                // Actualiza el estado local con los datos del backend
                setServices(prevServices => {
                    const updated = prevServices.map(service => {
                        if (service.id === id) {
                            return {
                                ...service,
                                customPrice: response.data.customPrice,
                                customDuration: response.data.customDuration,
                                customDescription: response.data.customDescription,
                                customBuffer: response.data.customBuffer || response.data.buffer || 0,
                                buffer: response.data.buffer || response.data.customBuffer || 0
                            };
                        }
                        return service;
                    });
                    
                    return updated;
                });
                
                return { success: true, data: response.data };
            } else {
                console.error("❌ No hay datos en la respuesta del backend");
                return { success: false, error: "No se recibieron datos del servidor" };
            }
        } catch (err) {
            console.error("💥 Error completo en updateService:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                stack: err.stack
            });
            
            return { 
                success: false, 
                error: err.response?.data?.message || 
                    err.response?.data?.error || 
                    err.message || 
                    "Error al actualizar" 
            };
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