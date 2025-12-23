import axios from 'axios';

const API_URL = 'http://localhost:3000/time-slots';

class TimeSlotAPI {
  /**
   * Obtiene todos los turnos de un día específico
   * @param {string} dayId - ID del día de disponibilidad
   * @returns {Promise<Array>} Lista de turnos
   */
  static async getByDay(dayId) {
    const { data } = await axios.get(
      `${API_URL}/day/${dayId}`,
      { withCredentials: true }
    );
    return data;
  }

  /**
   * Crea un nuevo turno
   * @param {Object} slotData - Datos del turno (ej. { availabilityDayId, startTime, endTime })
   * @returns {Promise<Object>} Turno creado
   */
  static async create(slotData) {
    const { data } = await axios.post(
      API_URL,
      slotData,
      { withCredentials: true }
    );
    return data;
  }

  /**
   * Elimina un turno
   * @param {string} timeSlotId - ID del turno a eliminar
   * @returns {Promise<Object>} Mensaje de confirmación
   */
  static async delete(timeSlotId) {
    const { data } = await axios.delete(
      `${API_URL}/${timeSlotId}`,
      { withCredentials: true }
    );
    return data;
  }
}

export default TimeSlotAPI;