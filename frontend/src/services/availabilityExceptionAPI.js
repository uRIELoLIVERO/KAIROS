import axios from 'axios';

const API_URL = 'http://localhost:3000/availability-exceptions';

class AvailabilityExceptionAPI {
  /**
   * Obtiene todas las excepciones de un miembro del personal
   * @param {string} staffMemberId - ID del miembro del personal
   * @returns {Promise<Array>} Lista de excepciones
   */
  static async getByStaffMember(staffMemberId) {
    const { data } = await axios.get(
      `${API_URL}/staff/${staffMemberId}`,
      { withCredentials: true }
    );
    return data;
  }

  /**
   * Crea una nueva excepción
   * @param {Object} exceptionData - Datos de la excepción
   * @returns {Promise<Object>} Excepción creada
   */
  static async create(exceptionData) {
    const { data } = await axios.post(
      API_URL,
      exceptionData,
      { withCredentials: true }
    );
    return data;
  }

  /**
   * Elimina una excepción
   * @param {string} exceptionId - ID de la excepción a eliminar
   * @returns {Promise<Object>} Mensaje de confirmación
   */
  static async delete(exceptionId) {
    const { data } = await axios.delete(
      `${API_URL}/${exceptionId}`,
      { withCredentials: true }
    );
    return data;
  }
}

export default AvailabilityExceptionAPI;