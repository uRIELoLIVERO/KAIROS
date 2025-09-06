import axios from 'axios'
import ProfessionalAPI from './professionalAPI';
import UserAPI from './userAPI'
import { ROLES } from '../constants/roles';

class StaffMemberAPI {
    static async getUserStaffMembers(userId) {
        const { data } = await axios.get(
            `http://localhost:3000/staff-members/user/${userId}`, 
            { withCredentials: true }
        );
    return data
    }

    static async deleteStaffMember(staffMemberId) {
        await axios.delete(
            `http://localhost:3000/staff-members/${staffMemberId}`, 
            { withCredentials: true }
        )
    }
    
    static async addMember(companyId, email) {
        const { data } = await UserAPI.getUserByEmail(email)
        const professional = await ProfessionalAPI.getProfessionalByUserId(data.id)

        const newMember = await axios.post(
            'http://localhost:3000/staff-members',
            {
                companyId: companyId,
                professionalId: professional.id
            },
            { withCredentials: true}
        )
        return newMember
    }

    static async updateRole(staffMemberId, roleId) {
        const { data } = await axios.patch(
            `http://localhost:3000/staff-members/${staffMemberId}/role`,
            { roleId: roleId },
            {withCredentials: true}
        )
        return data
    }
    
    /**
    * Obtiene el personal de una empresa
    * @param {string} companyId - ID de la empresa
    * @returns {Promise<Array>} Lista del personal
    */
    static async getCompanyStaff(companyId) {
        const { data } = await axios.get(
            `http://localhost:3000/staff-members/company/${companyId}`,
            { withCredentials: true }
        );

        const result = await Promise.all(
            data.map(async (p) => {
            const professional = await ProfessionalAPI.getProfessionalById(p.professionalId);
            const roleName = Object.keys(ROLES).find(
                (key) => ROLES[key] === p.roleId
            );

            return {
                ...professional,
                role: roleName,
                staffMemberId: p.id
            };
            })
        );

        return result;
    }

}

export default StaffMemberAPI