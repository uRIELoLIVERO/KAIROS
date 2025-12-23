import { useCallback, useEffect, useState } from "react";
import AuthAPI from '../services/authAPI';

export const useAuth = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await AuthAPI.getloggedUser();
            setUser(data.user);
        } catch (err) {
            setError(err?.response?.data?.message || 'Error al cargar el usuario logeado');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return {
        loading,
        user,
        error,
        refetch: fetchUser
    };
};