import { useMemo } from "react";
import { ROLE_PERMISSIONS, ROLES } from '../constants/roles';
import { hasPermission } from '../utils/helpers';

/**
 * Hook para obtener los permisos del usuario en una compañía específica
 * @param {Array} staffMembers - Lista de staff members del usuario actual
 * @param {string} companyId - ID de la compañía actual
 * @returns {Object} Permisos y rol del usuario en esta compañía
 */
export const useCompanyPermissions = (staffMembers, companyId) => {
    return useMemo(() => {
        if (!staffMembers || !companyId) return {};
        
        // Encontrar el StaffMember del usuario actual en esta compañía
        const staffMember = staffMembers.find(
            member => member.companyId === companyId
        );
        
        if (!staffMember || !staffMember.roleId) return {};
        
        // Mapear el roleId al nombre del rol (según tu constante ROLES)
        const getRoleNameById = (roleId) => {
            return Object.keys(ROLES).find(key => ROLES[key] === roleId);
        };
        
        const roleName = getRoleNameById(staffMember.roleId);
        
        if (!roleName) return {};
        
        return {
            canManageStaff: hasPermission(roleName, ROLE_PERMISSIONS.canManageStaff),
            canManageCash: hasPermission(roleName, ROLE_PERMISSIONS.canManageCash),
            canManageServices: hasPermission(roleName, ROLE_PERMISSIONS.canManageServices),
            canEditSettings: hasPermission(roleName, ROLE_PERMISSIONS.canEditSettings),
            role: roleName,
            roleId: staffMember.roleId
        };
    }, [staffMembers, companyId]);
};