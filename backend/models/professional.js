import data from '../bd.json' with { type: 'json' };

const professionals = data.professional;

export class ProfessionalModel {
    static async getAllProfessionals() {
        return professionals;
    }

    static async getProfessionalByID(id) {
        return professionals.find(p => p.id === id);
    }
}