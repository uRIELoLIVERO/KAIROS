import axios from 'axios';

class CompanyAPI {
  /**
   * Obtiene las empresas del usuario actual
   * @returns {Promise<Array>} Lista de empresas
   */
  static async getMyCompanies() {
    const { data } = await axios.get(
      'http://localhost:3000/companies/my-companies', 
      { withCredentials: true }
    );
    return data;
  }

  /**
   * Crea una nueva empresa
   * @param {string} name - Nombre de la empresa
   * @returns {Promise<Object>} Datos de la empresa creada
   */
  static async createCompany(name) {
    const { data } = await axios.post(
      `http://localhost:3000/companies/`,
      { name: name }, 
      { withCredentials: true }
    );
    return data;
  }

  /**
   * Obtiene los datos de una empresa específica
   * @param {string} companyId - ID de la empresa
   * @returns {Promise<Object>} Datos de la empresa
   */
  static async getCompany(companyId) {
    const { data } = await axios.get(
      `http://localhost:3000/companies/${companyId}`,
      { withCredentials: true }
    );
    return data;
  }

  /**
   * Actualiza los datos de una empresa
   * @param {string} companyId - ID de la empresa
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Datos actualizados
   */
  static async updateCompany(companyId, updateData) {
    const { data } = await axios.patch(
      `http://localhost:3000/companies/${companyId}`, 
      updateData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      }
    );
    return data;
  }

  /**
   * Obtiene el personal de una empresa
   * @param {string} companyId - ID de la empresa
   * @returns {Promise<Array>} Lista del personal
   */
  static async getCompanyStaff(companyId) {
    const { data } = await axios.get(
      `http://localhost:3000/staff-members/company/${companyId}`,
      {withCredentials: true}
    );
    return data;
  }

  /**
   * Obtiene el reporte de caja de una empresa
   * @param {string} companyId - ID de la empresa
   * @param {string} period - Período del reporte
   * @returns {Promise<Object>} Reporte de caja
   */
  static async getCashReport(companyId, period = 'today') {
    const { data } = await axios.get(`/companies/${companyId}/cash/report?period=${period}`);
    return data;
  }

    /**
    * Obtiene los servicios de una empresa
    * @param {string} companyId - ID de la empresa
    * @returns {Promise<Array>} Lista de servicios
    */
    static async getCompanyServices(companyId) {
      const { data } = await axios.get(
        `http://localhost:3000/companies/${companyId}/services`,
        { withCredentials: true }
      );
    return data;
  }
}

export default CompanyAPI;