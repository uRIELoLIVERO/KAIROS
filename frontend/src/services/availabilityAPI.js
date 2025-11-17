import axios from 'axios';

const API_URL = 'http://localhost:3000/availabilities';

class AvailabilityAPI {
  /**
   * Obtiene la disponibilidad de un miembro del personal
   * @param {string} staffMemberId - ID del miembro del personal
   * @returns {Promise<Object>} Datos de la disponibilidad
   */
  static async getByStaffMember(staffMemberId) {
    const { data } = await axios.get(
      `${API_URL}/staff/${staffMemberId}`,
      { withCredentials: true }
    );
    return data;
  }

  /**
   * Crea una nueva disponibilidad (si no existe)
   * @param {Object} availabilityData - Datos para crear la disponibilidad (ej. { staffMemberId, name })
   * @returns {Promise<Object>} Datos de la disponibilidad creada
   */
  static async create(availabilityData) {
    const { data } = await axios.post(
      API_URL,
      availabilityData,
      { withCredentials: true }
    );
    return data;
  }
}

export default AvailabilityAPI;