import crypto from 'crypto';

import data from '../bd.json' with { type: 'json' };

const services = data.service;

export class ServiceModel {
    static async createService(data) {
        const newService = {
            id: crypto.randomUUID(),
            ...data,
        }
        services.push(newService);
        return newService;
    }

    static async getAllServices() {
        return services;
    }

    static async getServiceByID(id) {
        return services.find(s => s.id === id);
    }

    static async updateService(id, data) {
        const serviceIndex = services.findIndex(s => s.id === id);
        if (serviceIndex === -1) {
            return null;
        }
        const updatedService = {
            ...services[serviceIndex], 
            ...data };

        services[serviceIndex] = updatedService;
        return updatedService;
    }
    
    static async deleteService(id) {
        const serviceIndex = services.findIndex(s => s.id === id);
        if (serviceIndex === -1) {
            return null;
        }
        const deletedService = services.splice(serviceIndex, 1)[0];
        return deletedService;
    }
}