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
companiesRouter.get('/:id/professionals', StaffMemberController.getAllByCompany);

//services
// Get all services of a company (and by rol if needed)
companiesRouter.get('/:id/services', CompanyController.getAllServicesByCompany);
