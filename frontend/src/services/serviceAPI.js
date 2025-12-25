import axios from 'axios';

// URL base asumiendo que montas el router en /services
// Si tu app.use() principal usa otro prefijo (ej: /api/v1), ajusta esta URL.
const BASE_URL = 'http://localhost:3000/services';

const ServiceAPI = {
    /**
     * Obtiene todos los servicios del sistema
     * GET /
     */
    getAllServices: async () => {
        const { data } = await axios.get(BASE_URL, { withCredentials: true });
        return data;
    },

    /**
     * Obtiene un servicio por ID
     * GET /:id
     */
    getServiceById: async (id) => {
        const { data } = await axios.get(`${BASE_URL}/${id}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return data;
    },

    /**
     * Crea un nuevo servicio
     * POST /
     */
    createService: async (serviceData) => {
        const { data } = await axios.post(BASE_URL, serviceData, { withCredentials: true });
        return data;
    },

    /**
     * Actualiza un servicio
     * PUT /:id
     */
    updateService: async (id, serviceData) => {
        const { data } = await axios.put(`${BASE_URL}/${id}`, serviceData, { withCredentials: true });
        return data;
    },

    /**
     * Elimina un servicio
     * DELETE /:id
     */
    deleteService: async (id) => {
        const { data } = await axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });
        return data;
    }
};

export default ServiceAPI;