import { useState, useCallback, useEffect } from "react";
import OfferedServiceAPI from "../services/offeredServiceAPI";

export const useCompanyServices = (companyId) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchServices = useCallback(async (id) => {
        if (!id) {
            setLoading(false);
            setServices([]);
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            
            const response = await OfferedServiceAPI.getOfferedServicesByCompany(id);
            
            let data = Array.isArray(response) ? response : response?.data || [];
            
            const adaptedServices = data.map(service => ({
                id: service.id,
                offeredServiceId: service.id,
                name: service.name || 'Servicio',
                price: service.price || 0,
                duration: service.duration || 0,
                description: service.description || '',
                staffName: service.staffName || 'Staff no asignado',
                staffAvatar: service.staffAvatar
            }));
            
            setServices(adaptedServices);
            
        } catch (err) {
            console.error("Error fetching services:", err);
            setError(err.message || "Error al cargar servicios");
            setServices([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServices(companyId);
    }, [companyId, fetchServices]);

    return { 
        services, 
        loading, 
        error,
        refetch: () => fetchServices(companyId) 
    };
};