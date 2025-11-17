import { CompanyWorkingHoursModel } from '../models/sequelize/sequelize.js';
import { validateCompanyWorkingHours, validatePartialCompanyWorkingHours } from '../schemas/companyWorkingHours.js';

export class CompanyWorkingHoursController {

    static async getAllCompaniesWorkingHours(req, res) {
        try {
            const workingHours = await CompanyWorkingHoursModel.findAll();
            return res.status(200).json(workingHours);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getCompanyWorkingHoursById(req, res) {
        try {
            const { id } = req.params;
            const workingHours = await CompanyWorkingHoursModel.findByPk(id);
            return workingHours
                ? res.status(200).json(workingHours)
                : res.status(404).json({ error: 'Company working hours not found' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async createCompanyWorkingHours(req, res) {
        try {
            const result = validateCompanyWorkingHours(req.body);
            if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
            
            const newWorkingHours = await CompanyWorkingHoursModel.create(result.data);
            return res.status(201).json(newWorkingHours);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateCompanyWorkingHours(req, res) {
        try {
            const { id } = req.params;
            const result = validatePartialCompanyWorkingHours(req.body);
            if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

            const [affectedRows] = await CompanyWorkingHoursModel.update(result.data, { where: { id } });
            if (affectedRows === 0) return res.status(404).json({ error: 'Company working hours not found' });

            const updatedWorkingHours = await CompanyWorkingHoursModel.findByPk(id);
            return res.status(200).json(updatedWorkingHours);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async deleteCompanyWorkingHours(req, res) {
        try {
            const { id } = req.params;
            const workingHours = await CompanyWorkingHoursModel.findByPk(id);
            if (!workingHours) {
                return res.status(404).json({ error: 'Company working hours not found' });
            }

            await CompanyWorkingHoursModel.destroy({ where: { id } });
            return res.sendStatus(204);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}