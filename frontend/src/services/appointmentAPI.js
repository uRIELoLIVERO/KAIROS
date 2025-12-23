import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const AppointmentAPI = {
  // Crea una nueva cita
  createAppointment: async (appointmentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/appointments`, appointmentData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Obtiene una cita por ID
  getAppointment: async (appointmentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments/${appointmentId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  },

  // Obtiene citas por staff member y fecha
  getAppointmentsByStaffAndDate: async (staffMemberId, date) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/appointments/staff-members/${staffMemberId}`, 
        {
          params: { date },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching staff appointments:', error);
      return [];
    }
  },

  // Buscar citas por email y compañía
  getAppointmentsByEmailAndCompany: async (email, companyId, status = 'pending') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments/search`, {
        params: {
          email: email,
          companyId: companyId,
          status: status
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error searching appointments by email and company:', error);
      
      // Si el error es 400 (parámetros faltantes), retornar array vacío
      if (error.response?.status === 400) {
        return [];
      }
      
      throw error;
    }
  },

  // Cancela una cita
  cancelAppointment: async (appointmentId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/appointments/${appointmentId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error canceling appointment:', error);
      throw error;
    }
  },

  // Actualiza una cita
  updateAppointment: async (appointmentId, updateData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/appointments/${appointmentId}`, updateData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }
};

export default AppointmentAPI;