import data from '../bd.json' with { type: 'json' };

const services = data.service;

export class ServiceModel {
    getAllServices() {
        return services;
    }

    getServiceByID(id) {
        return services.find(s => s.id === id);
    }
}