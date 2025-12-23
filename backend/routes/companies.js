import { Router } from 'express';
import { CompanyController, upload } from '../controllers/company.js'
import { StaffMemberController } from '../controllers/staffMember.js';
import { authenticate } from '../middlewares/authenticate.js';

export const companiesRouter = Router();

// Rutas públicas
// ------------------
companiesRouter.get('/', CompanyController.getAllCompanies);

// Rutas que NO deben quedar atrás de /:id
companiesRouter.get('/my-companies', authenticate, CompanyController.getCompaniesByLoggedUser);

// Leer una compañía por ID
companiesRouter.get('/:id', CompanyController.getCompanyByID);

// CRUD y otras rutas dinámicas (requieren auth)
// ------------------
companiesRouter.use(authenticate);

// Crear
companiesRouter.post('/', CompanyController.createCompany);

// Actualizar
companiesRouter.patch('/:id', upload.single('icon'), CompanyController.updateCompany);

// Eliminar
companiesRouter.delete('/:id', CompanyController.deleteCompany);

// Professionals
companiesRouter.get('/:id/professionals', StaffMemberController.getAllByCompany);

// Services
companiesRouter.get('/:id/services', CompanyController.getAllServicesByCompany);
