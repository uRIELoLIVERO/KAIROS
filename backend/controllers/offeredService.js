import { OfferedServiceModel } from '../models/offeredService.js'
import { validateOfferedService, validatePartialOfferedService } from '../schemas/offeredService.js'

export class OfferedServiceController {
    static async createOfferedService(req, res) {
        try {
            console.log(req.body)
            const { error, data } = validatePartialOfferedService(req.body)
            if (error) {
                return res.status(400).json({ error: 'Offered service error' })
            }
            const offeredService = await OfferedServiceModel.createOfferedService(data)
            return res.status(201).json(offeredService)
        } catch (error) {
            console.error('Error:', error)
            return res.status(500).json({ error: 'Internal server error'})
        }
    }

    static async getOfferedServicesByProfessional(req, res) {
        try {
            const { professionalID } = req.params
            const offeredServices = await OfferedServiceModel.getOfferedServicesByProfessional(professionalID)

            if (offeredServices.length === 0 ) {
                return res.status(404).json({ error: 'offeredService not found' })
            }
            
            return res.status(200).json(offeredServices)
        } catch (error) {
            console.error('Error:', error)
            return res.status(500).json({ error: 'Internal server error'})
        }
    }

    static async updateOfferedService(req, res) {
        try {
            const { id } = req.params;
            const { error, data } = validatePartialOfferedService(req.body)
            if (error) {
                 return res.status(400).json({ error:' Offered service error' })
            }

            const offeredServiceUpdated = await OfferedServiceModel.updateOfferedService(id, data)
            return res.status(200).json(offeredServiceUpdated)
        } catch (error) {
            console.error('Error:', error)
            return res.status(500).json({ error: 'Internal server error'})
        }
    }

    static async deleteOfferedService(req, res) {
        try {
            const { id } = req.params;
            const deletedOfferedService = await OfferedServiceModel.deleteOfferedService(id)
            if (!deletedOfferedService) {
                return res.status(400).json({ error: 'Offered service error'})
            }
            return res.status(200).json({
                message: 'Offered service deleted succesfully',
                deletedOfferedService
            })
        } catch (error) {
            console.error('Error:', error)
            return res.status(500).json({ error: 'Internal server error'})
        }
    }
}