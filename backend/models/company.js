import data from '../bd.json' with { type: 'json' };

import { StaffMemberModel } from './staffMember.js';

const companies = data.company;

export class CompanyModel {
    static async createCompany(company) {
        const newCompany = {
            id: crypto.randomUUID(),
            ...company
        }
        companies.push(newCompany);
        return newCompany;
    }

    static async getAllCompanies() {
        return companies
    }

    static async getCompanyByID(id) {
        return companies.find(c => c.id === id);
    }

    static async updateCompany(id, companyData) {
        const index = companies.findIndex ( c => c.id === id);
        if (index === -1) {
            throw new Error('Company not found')
        }

        const updatedCompany = {
            ...companies[index],
            ...companyData,
        }

        companies[index] = updatedCompany;
        return updatedCompany;
    }

    static async deleteCompany(id) {
        const index = companies.findIndex(c => c.id === id);
        if (index === -1) {
            throw new Error('Company not found');
        }

        const deletedCompany = companies.splice(index, 1)[0];
        return deletedCompany;
    }

    static async getProfessionalByID(companyID, professionalId) {
        return StaffMemberModel.getOne(companyID, professionalId);
    }

    static async addProfessionalToCompany(companyID, professionalID, roles = []) {
        const company = await this.getCompanyByID(companyID);
        if (!company) throw new Error('Company not found');

        const availability = company.availability?.days || [];
        const availabilityException = company.availabilityException || [];

        return await StaffMemberModel.create({
        companyId: companyID,
        professionalId: professionalID,
        availability,
        availabilityException,
        roles
        });
    }

    static async removeProfessionalFromCompany(companyID, professionalID) {
        return await StaffMemberModel.remove(companyID, professionalID);
    }

    static async getAllServicesByCompany(companyID) {
        const company = await this.getCompanyByID(companyID);
        if (!company) {
            throw new Error('Company not found');
        }
        return company.services || [];
    }

    static async getServiceByID(companyID, serviceId) {
        const services = await this.getAllServicesByCompany(companyID);
        return services.find(s => s.id === serviceId);
    }

    static async addServiceToCompany(companyID, service) {
        const company = await this.getCompanyByID(companyID);
        if (!company) {
            throw new Error('Company not found');
        }

        if (!company.services) {
            company.services = [];
        }

        // Evitar duplicados
        const exists = company.services.some(s => s.id === service.id);
        if (exists) {
            throw new Error('Service already exists in this company');
        }

        company.services.push(service);
        return service;
    }

    static async removeServiceFromCompany(companyID, serviceId) {
        const company = await this.getCompanyByID(companyID);
        if (!company) {
            throw new Error('Company not found');
        }

        const index = company.services.findIndex(s => s.id === serviceId);
        if (index === -1) {
            throw new Error('Service not found in this company');
        }

        const removedService = company.services.splice(index, 1)[0];
        return removedService;
    }
}