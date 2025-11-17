import { Router } from "express";
import { CompanyWorkingHoursController } from "../controllers/companyWorkingHours.js";
import { authenticate } from "../middlewares/authenticate.js";

export const companyWorkingHoursRouter = Router()

companyWorkingHoursRouter.use(authenticate)

companyWorkingHoursRouter.get('/', CompanyWorkingHoursController.getAllCompaniesWorkingHours);
companyWorkingHoursRouter.get('/:id', CompanyWorkingHoursController.getCompanyWorkingHoursById);
companyWorkingHoursRouter.post('/', CompanyWorkingHoursController.createCompanyWorkingHours);
companyWorkingHoursRouter.put('/:id', CompanyWorkingHoursController.updateCompanyWorkingHours);
companyWorkingHoursRouter.delete('/:id', CompanyWorkingHoursController.deleteCompanyWorkingHours);