import { Router } from 'express';
import { CompanyController } from '../controllers/company.js'
import { StaffMemberController } from '../controllers/staffMember.js';

export const companiesRouter = Router();

// CRUD
// Create a new company
companiesRouter.post('/', CompanyController.createCompany);

// Read all companies
companiesRouter.get('/', CompanyController.getAllCompanies);

// Read a specific company by ID
companiesRouter.get('/:id', CompanyController.getCompanyByID);

// Update an existing company by ID
companiesRouter.put('/:id', CompanyController.updateCompany);

// Delete a company by ID
companiesRouter.delete('/:id', CompanyController.deleteCompany);

//professionals
// Get all professionals of a company (and by rol if needed)
companiesRouter.get('/:id/professionals', StaffMemberController.getAllProfessionalsByCompany);

// Get professional by ID
companiesRouter.get('/:id/professionals/:professionalID', CompanyController.getProfessionalByID);

// Add a professional to a company
companiesRouter.post('/:id/professionals/:professionalID', CompanyController.addProfessionalToCompany);

// Remove a professional from a company
companiesRouter.delete('/:id/professionals/:professionalID', CompanyController.removeProfessionalFromCompany);

//services
// Get all services of a company (and by rol if needed)
companiesRouter.get('/:id/services', CompanyController.getAllServicesByCompany);

// Add a service to a company
companiesRouter.post('/:id/services', CompanyController.addServiceToCompany);

// Remove a service from a company
companiesRouter.delete('/:id/services/:serviceID', CompanyController.removeServiceFromCompany);