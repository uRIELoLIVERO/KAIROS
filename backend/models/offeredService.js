import crypto from 'crypto';

import data from '../bd.json' with { type: 'json' };

const offeredServices = data.offeredService

export class OfferedServiceModel {
    static async createOfferedService(offeredService){
        const newOfferedService = {
            id: crypto.randomUUID(),
            ...offeredService
        }
        offeredServices.push(newOfferedService)
        return newOfferedService
    }

    static async getOfferedServicesByProfessional(professionalID){
        return offeredServices.filter(o => o.staffMemberID === professionalID)
    }

    static async updateOfferedService(id, updatedData){
        const offeredServiceIndex = offeredServices.findIndex( o => o.id === id)
        if (offeredServiceIndex === -1){
            throw new Error('Offered Service not found')
        }

        const updatedOfferedService = {
            ...offeredServices[offeredServiceIndex],
            ...updatedData
        }

        offeredServices[offeredServiceIndex] = updatedOfferedService
        return updatedOfferedService

    }

    static async deleteOfferedService(id){
        const offeredServiceIndex = offeredServices.findIndex( o => o.id === id)
        if (offeredServiceIndex === -1){
            throw new Error('Offered Service not found')
        }
        const deletedOfferedService = offeredServices.splice(offeredServiceIndex, 1)[0]
        return deletedOfferedService
    }
}