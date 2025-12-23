import { useCallback, useEffect, useState } from "react";
import StaffMemberAPI from '../services/staffMemberAPI';

export const useUserStaffMembers = (userId = null) => {
    const [staffMembers, setStaffMembers] = useState([]);
    const [loading, setLoading] = useState(!!userId); // Solo carga inicial si hay usuario
    const [error, setError] = useState(null);

    // 1. Obtener los staff members del usuario (Solo si hay userId)
    const fetchStaffMembers = useCallback(async () => {
        // CLAVE: Si no hay userId, no hacemos la petición GET /user/null
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await StaffMemberAPI.getUserStaffMembers(userId);
            setStaffMembers(data);
        } catch (err) {
            console.error("Error fetching user staff members:", err);
            setError(err.message || 'Error al cargar staff members');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchStaffMembers();
    }, [fetchStaffMembers]);

    // 2. Eliminar un StaffMember
    const deleteStaffMember = useCallback(async (staffMemberId) => {
        try {
            setLoading(true);
            await StaffMemberAPI.deleteStaffMember(staffMemberId);
            setStaffMembers(prev => prev.filter(member => member.id !== staffMemberId && member.staffMemberId !== staffMemberId));
            return { success: true };
        } catch (err) {
            setError(err.message || 'Error al eliminar miembro');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. Agregar un miembro a una empresa
    const addMember = useCallback(async (companyId, email) => {
        try {
            setLoading(true);
            const newMember = await StaffMemberAPI.addMember(companyId, email);
            return { success: true, data: newMember.data };
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Error al agregar miembro';
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    // 4. Actualizar el rol
    const updateRole = useCallback(async (staffMemberId, roleId) => {
        try {
            setLoading(true);
            const updatedData = await StaffMemberAPI.updateRole(staffMemberId, roleId);
            setStaffMembers(prev => prev.map(member => {
                if (member.id === staffMemberId || member.staffMemberId === staffMemberId) {
                    return { ...member, ...updatedData, roleId: roleId };
                }
                return member;
            }));
            return { success: true, data: updatedData };
        } catch (err) {
            setError(err.message || 'Error al actualizar rol');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // 5. Obtener personal de una empresa (Función independiente, no requiere userId)
    const getCompanyStaff = useCallback(async (companyId) => {
        if (!companyId) return { success: false, error: "ID de empresa requerido" };
        
        try {
            // No activamos el loading global del hook para no afectar otras partes
            const data = await StaffMemberAPI.getCompanyStaff(companyId);
            return { success: true, data };
        } catch (err) {
            return { success: false, error: err.message || 'Error al obtener personal de la empresa' };
        }
    }, []);

    return { 
        staffMembers, 
        loadingStaffMembers : loading, 
        error,
        refetch: fetchStaffMembers,
        deleteStaffMember,
        addMember,
        updateRole,
        getCompanyStaff
    };
};