import { isValidUUID } from '../utils/uuid.js';
import { CompanyModel, ProfessionalModel, ServiceModel } from '../models/sequelize/sequelize.js';

import { validateCompany, validatePartialCompany } from '../schemas/company.js';


export class CompanyController {
    static async createCompany (req, res){
        try {
            const { error, data } = validatePartialCompany(req.body);
            
            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const newCompany = await CompanyModel.createCompany(data);
            return res.status(201).json(newCompany);            
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });   
        }
    }
    
    static async getAllCompanies (req, res){
        try {
            const companies = await CompanyModel.getAllCompanies();
            if (companies.length === 0) {
                return res.status(404).json({ error: 'No companies found' });
            }
            return res.status(200).json(companies);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });   
        }
    }

    static async getCompanyByID (req, res){
        try {
            const id = req.params.id;
            const company = await CompanyModel.getCompanyByID(id);
            company ? res.status(200).json(company) : res.status(404).json({ error: 'Company not found' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });   
        }
    }

    static async updateCompany (req, res){
        try {
            const id = req.params.id;
            const { error, data } = validatePartialCompany(req.body);
            if (error) {
                return res.status(400).json({ error: 'Company not found'})
            }
            const updatedCompany = await CompanyModel.updateCompany(id, data);
            return res.status(200).json(updatedCompany)

        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });   
        }
    }

    static async deleteCompany (req, res){
        try {
            const id = req.params.id
            const deletedCompany = await CompanyModel.deleteCompany(id);
            deletedCompany
                ? res.status(200).json({ 
                    message: 'Company deleted successfully',
                    deletedCompany
                    })
                : res.status(404).json({ error: 'Company not found' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });   
        }
    }

    static async getProfessionalByID (req, res){
        try {
            const { id, professionalID } = req.params;
            const professional = await CompanyModel.getProfessionalByID(id, professionalID);
            professional ? res.status(200).json(professional) : res.status(404).json({ error: 'Professional not founD'})
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });   
        }
    }

    static async addProfessionalToCompany(req, res) {
        try {
            const { id, professionalID } = req.params;

            // Validación básica del formato
            if (!isValidUUID(id) || !isValidUUID(professionalID)) {
            return res.status(400).json({ error: "Invalid IDs" });
            }

            // Buscar empresa y profesional

            const company = await CompanyModel.getCompanyByID(id);
            const professional = await ProfessionalModel.getProfessionalByID(professionalID);

            if (!company || !professional) {
            return res.status(404).json({ error: "Company or professional not found" });
            }

            // Si se permiten roles personalizados desde el body (opcional)
            const { roles } = req.body;
            const staffMember = await CompanyModel.addProfessionalToCompany(id, professionalID, roles);

            return res.status(201).json({ message: "Professional added to company", staffMember });

        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }


    static async removeProfessionalFromCompany (req, res){
        try {
            const { id, professionalID } = req.params;
            const deletedProfessional = await CompanyModel.removeProfessionalFromCompany(id, professionalID)
            deletedProfessional
                ? res.status(200).json({ message: 'Professional removed successfully' })
                : res.status(404).json({ error: 'Professional not found in this company' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });   
        }
    }

    static async getAllServicesByCompany (req, res){
        try {
            const id = req.params.id;
            const services = await CompanyModel.getAllServicesByCompany(id);
            if (services.length === 0) {
                return res.status(404).json({ error: 'No services found for this company' });
            }
            return res.status(200).json(services);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });   
        }
    }

    static async getServiceByID (req, res){
        try {
            const { id, serviceID } = req.params;
            const service = await CompanyModel.getServiceByID(id, serviceID);
            service ? res.status(200).json(service) : res.status(404).json({ error: 'Service not found'})
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });   
        }
    }

    static async addServiceToCompany (req, res){
        try {

            const { id, serviceID } = req.params;
            // Validación básica del formato
            if (!isValidUUID(id) || !isValidUUID(serviceID)) {
            return res.status(400).json({ error: "Invalid IDs" });
            }

            // Buscar empresa y profesional
            const company = await CompanyModel.getCompanyByID(id);
            const service = await ServiceModel.getServiceByID(serviceID);

            if (!company || !service) {
            return res.status(404).json({ error: "Company or service not found" });
            }

            // Evitar duplicados
            if (company.services.includes(serviceID)) {
            return res.status(400).json({ error: "Service already assigned to company" });
            }

            // Asignar
            company.services.push(serviceID);
            await CompanyModel.update(id, company);

            return res.status(200).json({ message: "Service added successfully" });

        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });   
        }
    }

    static async removeServiceFromCompany (req, res){
        try {
            const { id, serviceID } = req.params;
            const deletedCompany = await CompanyModel.removeServiceFromCompany(id, serviceID)
            deletedCompany
                ? res.status(200).json({ message: 'Service removed successfully' })
                : res.status(404).json({ error: 'Service not found in this company' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });   
        }
    }
}