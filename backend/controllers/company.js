import { AppointmentModel, CompanyModel, ProfessionalModel, ServiceModel, StaffMemberModel } from '../models/sequelize/sequelize.js';
import { validateCompany, validatePartialCompany } from '../schemas/company.js';
import crypto from 'crypto';
import { Op } from 'sequelize';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de multer para almacenamiento de archivos (FUERA de la clase)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/company-icons/';
        // Crear directorio si no existe
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'company-' + uniqueSuffix + path.extname(file.originalname));
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

// Exportar upload como constante separada (FUERA de la clase)
export const upload = multer({
    storage: storage,
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

export class CompanyController {

    static transformCompanyData(company) {
        const data = company.toJSON ? company.toJSON() : company;
        
        const transformedData = {
            id: data.id,
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

            const professional = await ProfessionalModel.findOne({ where: {userId: req.user.id}})

            const newOwner = await StaffMemberModel.create({
                id: crypto.randomUUID(),
                professionalId: professional.id,
                companyId: newCompany.id,
                roleId: 4 
            })
            

            return res.status(201).json('Company created', CompanyController.transformCompanyData(newCompany), '\n And you added like the owner:', newOwner);            
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

            // Procesar la imagen si se subió
            if (req.file) {
                // Guardar la ruta de la imagen en el body
                req.body.icon = `/uploads/company-icons/${req.file.filename}`;
                
                // Si ya tenía una imagen anterior, eliminarla
                if (req.body.oldIcon) {
                    const oldPath = path.join(__dirname, '..', 'public', req.body.oldIcon);
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                }
            }

            const { error, data } = validatePartialCompany(req.body);
            if (error) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({ error: 'Datos inválidos' });
            }
            
            await CompanyModel.update(data, { where: { id } });
            const updatedCompany = await CompanyModel.findByPk(id);
            
            return res.status(200).json(CompanyController.transformCompanyData(updatedCompany));

        } catch (error) {
            console.error('Error:', error);
            // Si hay un error, eliminar el archivo subido (si existe)
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
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

    static async getAllServicesByCompany (req, res){
        try {
            const id = req.params.id;
            const services = await ServiceModel.findAll({ where: {companyId: id}});
            if (services.length === 0) {
                return res.status(404).json({ error: 'No services found for this company' });
            }
            return res.status(200).json(services);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });   
        }
    }

    static async getCompaniesByLoggedUser(req, res) {
        try {
            // 1. Obtener el profesional asociado al usuario
            const professional = await ProfessionalModel.findOne({
                where: { userId: req.user.id }
            });
            if (!professional) {
                return res.status(404).json({ error: 'Professional not found' });
            }

            // 2. Obtener los staff members del profesional
            const staffMembers = await StaffMemberModel.findAll({
                where: { professionalId: professional.id }
            });

            if (staffMembers.length === 0) {
                return res.status(404).json({ error: 'No staff members found' });
            }

            // 3. Extraer los companyId únicos
            const companyIds = [...new Set(staffMembers.map(sm => sm.companyId))];

            // 4. Obtener todas las compañías correspondientes
            const companies = await CompanyModel.findAll({
                where: { id: { [Op.in]: companyIds } }
            });

            return res.status(200).json(companies.map(c => CompanyController.transformCompanyData(c)));
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

}