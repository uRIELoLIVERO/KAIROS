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
                "customDescription": data.customDescription
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
        const updatedOfferedService = await axios.put(
            `http://localhost:3000/offered-services/${offeredServiceId}`,
            {
                "customPrice": data.customPrice,
                "customDuration": data.customDuration,
                "customDescription": data.customDescription
            },
            { withCredentials: true }
        );
        return updatedOfferedService;
    }
}

