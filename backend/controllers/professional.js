import { ProfessionalModel } from '../models/sequelize/sequelize.js';
import { validatePartialProfessional } from '../schemas/professional.js';

export class ProfessionalController {
  static async getProfessionalById(req, res) {
    try {
      const { id } = req.params;

      const professional = await ProfessionalModel.findByPk(id, {
        include: ['user'] // incluir datos del usuario si están relacionados
      });

      if (!professional) {
        return res.status(404).json({ error: 'Professional not found' });
      }

      return res.status(200).json(professional);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateProfessional(req, res) {
    try {
      const { id } = req.params;
      const { error, data } = validatePartialProfessional(req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const [rowsUpdated] = await ProfessionalModel.update(data, {
        where: { id }
      });

      if (!rowsUpdated) {
        return res.status(404).json({ error: 'Professional not found' });
      }

      const updated = await ProfessionalModel.findByPk(id);
      return res.status(200).json(updated);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
