import axios from "axios";

export default class OfferedServiceAPI {
    static async createOfferedService(data) {
        const newOfferedService = await axios.post(
            "http://localhost:3000/offered-services",
            {
                "staffMemberId": data.staffMemberId,
                "serviceId": data.serviceId,
                "customPrice": data.customPrice,
                "customDuration": data.customDuration,
                "customDescription": data.customDescription,
                "customBuffer": data.customBuffer
            },
            { withCredentials: true }
        );
        return newOfferedService;
    }

    static async getMyOfferedServices() {
        const { data } = await axios.get(
            "http://localhost:3000/offered-services/my-offered-services",
            { withCredentials: true }
        );
        return data;
    }

    static async deleteOfferedService(offeredServiceId) {
        const response = await axios.delete(
            `http://localhost:3000/offered-services/${offeredServiceId}`,
            { withCredentials: true }
        );
        return response;
    }

    static async updateOfferedService(offeredServiceId, data) {
        // 1. Sanity check: Verificamos antes de enviar
        if (!data) {
            console.error("❌ Error: Intentando actualizar sin datos (data es null o undefined)");
            throw new Error("No se proporcionaron datos para actualizar");
        }

        console.log("📡 OfferedServiceAPI.updateOfferedService llamado:", {
            id: offeredServiceId,
            payload: data
        });
        
        try {
            
            const cleanPayload = { ...data };

            const response = await axios.put(
                `http://localhost:3000/offered-services/${offeredServiceId}`,
                cleanPayload, 
                { 
                    withCredentials: true 
                }
            );
            
            console.log("✅ Respuesta de API exitosa:", response.data);
            return response;
        } catch (error) {
            console.error("❌ Error en API call updateOfferedService:", {
                message: error.message
            });
            throw error;
        }
    }

    static async getServiceById(serviceId) {
        const { data } = await axios.get(
            `http://localhost:3000/offered-services/${serviceId}`,  
            { withCredentials: true }
        );
        return data;
    }
    
    static async getOfferedServicesByCompany(companyId) {
        const { data } = await axios.get(
            `http://localhost:3000/offered-services/company/${companyId}`, 
            { withCredentials: true }
        );
        return data;
    }
    
    static async getOfferedServicesByProfessional(staffMemberId) {
        const { data } = await axios.get(
            `http://localhost:3000/offered-services/staff/${staffMemberId}`,
            { withCredentials: true }
        );
        return data;
    }
}

