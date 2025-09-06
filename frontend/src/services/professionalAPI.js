import axios from 'axios'

class ProfessionalAPI {
    static async getProfessionalById(professionalId) {
        const { data } = await axios.get(
            `http://localhost:3000/professionals/${professionalId}`, 
            { withCredentials: true }
        );
        return data
    }

    static async getProfessionalByUserId (userId) {
        const { data } = await axios.get(
            `http://localhost:3000/professionals/user/${userId}`, 
            { withCredentials: true }
        );
        return data
    }

}

export default ProfessionalAPI