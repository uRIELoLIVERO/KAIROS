import { isValidUUID } from '../utils/uuid.js';
import { AppointmentModel, CompanyModel, ProfessionalModel, ServiceModel, StaffMemberModel } from '../models/sequelize/sequelize.js';
import crypto from 'crypto';
import { validateCompany, validatePartialCompany } from '../schemas/company.js';
import { validateStatus } from '../schemas/status.js';
import availability from '../models/sequelize/availability.js';
import { StaffMemberController } from './staffMember.js';


export class CompanyController {
        static transformCompanyData(company) {
        const data = company.toJSON ? company.toJSON() : company;
        
        const transformedData = {
            name: data.name,
            icon: data.icon,
            location: data.location,
            createdAt: data.created_at || data.createdAt,
            updatedAt: data.updated_at || data.updatedAt,
            deletedAt: data.deleted_at || data.deletedAt
        };
        
        Object.keys(transformedData).forEach(key => {
            if (transformedData[key] === undefined) {
                delete transformedData[key];
            }
        });
        
        return transformedData;
    }

    static async createCompany (req, res){
        try {
            const resultCompany = validatePartialCompany(req.body);
            if (!resultCompany.success) {
                return res.status(400).json({ error: resultCompany.error.message });
            }
            const data = resultCompany.data

            const newCompany = await CompanyModel.create({
                ...data,
                id: crypto.randomUUID(),
            });

            // When you create a company, you are assigned the role of Owner by default

            return res.status(201).json(CompanyController.transformCompanyData(newCompany));            
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });   
        }
    }
    
    static async getAllCompanies (req, res){
        try {
            const companies = await CompanyModel.findAll({ raw: false });
            if (companies.length === 0) {
                return res.status(404).json({ error: 'No companies found' });
            }
            return res.status(200).json(companies.map( c => CompanyController.transformCompanyData(c)));
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });   
        }
    }

    static async getCompanyByID (req, res){
        try {
            const id = req.params.id;
            const company = await CompanyModel.findByPk(id);
            company ? res.status(200).json(CompanyController.transformCompanyData(company)) : res.status(404).json({ error: 'Company not found' });
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
            await CompanyModel.update(data, { where: { id } });
            const updatedCompany = await CompanyModel.findByPk(id)
            return res.status(200).json(CompanyController.transformCompanyData(updatedCompany))

        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });   
        }
    }

    static async deleteCompany (req, res){
        try {
            const { id } = req.params

            const company = await CompanyModel.findByPk(id);

            if (!company)
                return res.status(404).json({ error: 'Company not found' });

            const companyData = CompanyController.transformCompanyData(company)

            await AppointmentModel.destroy({
                where: { id },
                individualHooks: true
            })

            return res.status(200).json({
                message: 'Company deleted successfully',
                deletedCompany: companyData
            })
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