import axios from 'axios';

const API_URL = 'http://localhost:3000/availability-days';

class AvailabilityDayAPI {
  /**
   * Obtiene todos los días de una disponibilidad específica
   * @param {string} availabilityId - ID de la disponibilidad principal
   * @returns {Promise<Array>} Lista de días
   */
  static async getByAvailability(availabilityId) {
    const { data } = await axios.get(
      `${API_URL}/availability/${availabilityId}`,
      { withCredentials: true }
    );
    return data;
  }

  /**
   * Actualiza un día de disponibilidad (ej. activar/desactivar)
   * @param {string} dayId - ID del día a actualizar
   * @param {Object} updateData - Datos a actualizar (ej. { isEnabled: true })
   * @returns {Promise<Object>} Datos actualizados
   */
  static async update(dayId, updateData) {
    const { data } = await axios.put(
      `${API_URL}/${dayId}`,
      updateData,
      { withCredentials: true }
    );
    return data;
  }

  static async createAvailabilityDay(availabilityId) {
    const { data } = await axios.post(
      `${API_URL}/${availabilityId}`,
      {},
      { withCredentials: true }
    );
    return data;
  }
}

export default AvailabilityDayAPI;