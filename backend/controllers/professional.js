import { ProfessionalModel, UserModel } from '../models/sequelize/sequelize.js';
import { validatePartialProfessional } from '../schemas/professional.js';

export class ProfessionalController {
  static async getProfessionalById(req, res) {
    try {
      const { id } = req.params;

      const professional = await ProfessionalModel.findByPk(id, {
        include: ['user']
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

      const professional = await ProfessionalModel.findByPk(id, {
        include: [{ model: UserModel, as: 'user' }]
      });

      if (!professional) {
        return res.status(404).json({ error: 'Professional not found' });
      }

      // Dividimos los datos entre Professional y User
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        ...professionalData
      } = data;

      // Actualizar campos del modelo User si vienen
      if (professional.user) {
        await professional.user.update({
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(email && { email }),
          ...(phoneNumber && { phoneNumber })
        });
      }

      // Actualizar campos del modelo Professional
      await professional.update(professionalData);

      // Volver a obtener el registro actualizado
      const updated = await ProfessionalModel.findByPk(id, {
        include: [{ model: UserModel, as: 'user' }]
      });

      return res.status(200).json(updated);

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getProfessionalByUserId(req, res) {
        try {
      const { id } = req.params;

      const professional = await ProfessionalModel.findOne({
            where: { userId: id },
            include: ['user']
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
}
