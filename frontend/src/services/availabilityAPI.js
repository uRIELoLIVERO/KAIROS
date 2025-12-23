import axios from 'axios';

const API_URL = 'http://localhost:3000';

class AvailabilityAPI {
  /**
   * Obtiene la disponibilidad de un miembro del personal
   * @param {string} staffMemberId - ID del miembro del personal
   * @returns {Promise<Object>} Datos de la disponibilidad
   */
  static async getByStaffMember(staffMemberId) {
    try {
      const { data } = await axios.get(
        `${API_URL}/availabilities/staff/${staffMemberId}`,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      // Si es 404, retornamos null en lugar de lanzar error
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Crea una nueva disponibilidad
   * @param {Object} availabilityData - Datos para crear la disponibilidad
   * @returns {Promise<Object>} Datos de la disponibilidad creada
   */
  static async create(availabilityData) {
    const { data } = await axios.post(
      `${API_URL}/availabilities`,
      availabilityData,
      { withCredentials: true }
    );
    return data;
  }

  /**
   * Actualiza una disponibilidad existente
   * @param {string} id - ID de la disponibilidad
   * @param {Object} availabilityData - Datos actualizados
   * @returns {Promise<Object>} Datos de la disponibilidad actualizada
   */
  static async update(id, availabilityData) {
    const { data } = await axios.put(
      `${API_URL}/availabilities/${id}`,
      availabilityData,
      { withCredentials: true }
    );
    return data;
  }

  /**
   * Agrega un time slot a una disponibilidad
   * @param {string} availabilityId - ID de la disponibilidad
   * @param {Object} timeSlotData - Datos del time slot
   * @returns {Promise<Object>} Datos actualizados
   */
  static async addTimeSlot(availabilityId, timeSlotData) {
    const { data } = await axios.post(
      `${API_URL}/availabilities/${availabilityId}/time-slots`,
      timeSlotData,
      { withCredentials: true }
    );
    return data;
  }

  /**
   * Elimina un time slot
   * @param {string} availabilityId - ID de la disponibilidad
   * @param {string} timeSlotId - ID del time slot
   * @returns {Promise<Object>} Respuesta del servidor
   */
  static async removeTimeSlot(availabilityId, timeSlotId) {
    const { data } = await axios.delete(
      `${API_URL}/availabilities/${availabilityId}/time-slots/${timeSlotId}`,
      { withCredentials: true }
    );
    return data;
  }
}

export default AvailabilityAPI;