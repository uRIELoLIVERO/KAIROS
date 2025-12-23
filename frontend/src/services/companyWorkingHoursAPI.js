import axios from 'axios';

// Asume que tienes una URL base configurada, si no, cambia esto por tu URL completa (ej: http://localhost:3000/api)
const API_URL = '/company-working-hours'; 

// Si ya tienes una instancia de axios configurada con interceptores para el token, impórtala y úsala en lugar de 'axios' directo.
// import api from './axiosConfig'; 

const CompanyWorkingHoursAPI = {
  /**
   * Obtiene todos los horarios de todas las empresas
   * GET /
   */
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  /**
   * Obtiene un registro de horario específico por su ID (PK)
   * GET /:id
   */
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  /**
   * Crea un nuevo horario
   * POST /
   * @param {Object} data { companyId, dayOfWeek, openingTime, closingTime }
   */
  create: async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  /**
   * Actualiza un horario existente
   * PUT /:id
   * @param {number} id - ID del horario
   * @param {Object} data - Datos a actualizar
   */
  update: async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Elimina un horario
   * DELETE /:id
   */
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};

export default CompanyWorkingHoursAPI;