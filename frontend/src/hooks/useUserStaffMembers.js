// hooks/useUserStaffMembers.js
import { useCallback, useEffect, useState } from "react";
import StaffMemberAPI from '../services/staffMemberAPI';

export const useUserStaffMembers = (userId) => {
    const [staffMembers, setStaffMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchStaffMembers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await StaffMemberAPI.getUserStaffMembers(userId);
            setStaffMembers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchStaffMembers();
    }, [fetchStaffMembers]);

    return { 
        staffMembers, 
        loading, 
        error 
    };
};