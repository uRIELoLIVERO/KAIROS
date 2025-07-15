import data from '../bd.json' with { type: 'json' };
import crypto from 'node:crypto';

const staffMembers = data.staffMember;

export class StaffMemberModel {
  static async create({ companyID, professionalID, availability, availabilityException, roles }) {
    const exists = staffMembers.some(
      m => m.companyID === companyID && m.professionalID === professionalID
    );
    if (exists) {
      throw new Error('Professional already belongs to this company');
    }

    const newMember = {
      id: crypto.randomUUID(),
      companyID,
      professionalID,
      availability,
      availabilityException,
      roles: roles.length > 0 ? roles : ['professional']
    };

    staffMembers.push(newMember);
    return newMember;
  }

  static async getAllProfessionalsByCompany(companyID) {
    return staffMembers.filter(m => m.companyID === companyID);
  }

  static async getOne(companyID, professionalID) {
    return staffMembers.find(m => m.companyID === companyID && m.professionalID === professionalID);
  }

  static async remove(companyID, professionalID) {
    const index = staffMembers.findIndex(m => m.companyID === companyID && m.professionalID === professionalID);
    if (index !== -1) {
      return staffMembers.splice(index, 1)[0];
    }
    return null;
  }
}
