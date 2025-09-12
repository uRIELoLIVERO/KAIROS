import { ProfessionalModel, UserModel } from '../models/sequelize/sequelize.js';
import { validatePartialProfessional } from '../schemas/professional.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de multer para almacenamiento de avatars de profesionales
const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/professional-avatars/';
        // Crear directorio si no existe
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'professional-avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtrar solo imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen'), false);
    }
};

// Middleware para subir avatars de profesionales
export const upload = multer({
    storage: avatarStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Límite de 5MB
    }
});

// Solución para __dirname en ES Modules
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

      // Procesar la imagen si se subió
      if (req.file) {
        console.log('Archivo recibido:', req.file.filename); // Debug
        // Guardar la ruta de la imagen en el body para que se procese en la validación
        req.body.profilePicture = `/uploads/professional-avatars/${req.file.filename}`;
        
        // Si se proporciona una imagen anterior en el body, eliminarla
        if (req.body.oldProfilePicture) {
          const oldPath = path.join(__dirname, '..', 'public', req.body.oldProfilePicture);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      }

      // Validar los datos (ahora incluye profilePicture si se subió un archivo)
      const { error, data } = validatePartialProfessional(req.body);
      if (error) {
        // Si hay error de validación, eliminar el archivo subido (si existe)
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ error: error.message });
      }

      const professional = await ProfessionalModel.findByPk(id, {
        include: [{ model: UserModel, as: 'user' }]
      });

      if (!professional) {
        // Eliminar el archivo subido si el profesional no existe
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ error: 'Professional not found' });
      }

      // Guardar la imagen anterior antes de actualizar (para posible eliminación posterior)
      const oldProfilePicture = professional.profilePicture;

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

      // Si se subió una nueva imagen y había una anterior, eliminarla
      if (req.file && oldProfilePicture && oldProfilePicture !== professionalData.profilePicture) {
        const oldPath = path.join(__dirname, '..', 'public', oldProfilePicture);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Volver a obtener el registro actualizado
      const updated = await ProfessionalModel.findByPk(id, {
        include: [{ model: UserModel, as: 'user' }]
      });

      return res.status(200).json(updated);

    } catch (error) {
      console.error('Error:', error);
      // Si hay un error, eliminar el archivo subido (si existe)
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
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

  // Método para eliminar avatar (opcional, si quieres mantenerlo)
  static async deleteAvatar(req, res) {
    try {
      const { id } = req.params;

      const professional = await ProfessionalModel.findByPk(id);
      
      if (!professional) {
        return res.status(404).json({ error: 'Professional not found' });
      }

      if (professional.profilePicture) {
        const oldPath = path.join(__dirname, '..', 'public', professional.profilePicture);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }

        await professional.update({ profilePicture: null });
        
        // Obtener el profesional actualizado
        const updatedProfessional = await ProfessionalModel.findByPk(id, {
          include: ['user']
        });
        
        return res.status(200).json({
          message: 'Avatar eliminado correctamente',
          professional: updatedProfessional
        });
      }

      return res.status(200).json({ message: 'No había avatar para eliminar' });

    } catch (error) {
      console.error('Error deleting avatar:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}