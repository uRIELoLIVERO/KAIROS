import axios from "axios";

class ServiceAPI {
    static async updateService(staffId, data) {
        const updatedService = await axios.put(
            `http://localhost:3000/services/${staffId}`,
            {
                name: data.name,
                description: data.description,
                suggestedPrice: data.suggestedPrice,
                suggestedDuration: data.suggestedDuration,
            },
            { withCredentials: true }
        )
    
        return updatedService
    }

    static async createService(companyId, data) {
        const service = await axios.post(
            'http://localhost:3000/services',
            {
                name: data.name,
                description: data.description,
                suggestedPrice: data.suggestedPrice,
                suggestedDuration: data.suggestedDuration,
                companyId: companyId
            },
            { withCredentials: true }
        )
    
        return service
    }
}

export default ServiceAPI