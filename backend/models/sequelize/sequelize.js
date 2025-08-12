import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import initModels from './init-models.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql',
  }
);

const models = initModels(sequelize);

export const {
  appointment: AppointmentModel,
  availability: AvailabilityModel,
  availability_day: AvailabilityDayModel,
  availability_exception: AvailabilityExceptionModel,
  client: ClientModel,
  company: CompanyModel,
  global_role: GlobalRoleModel,
  offered_service: OfferedServiceModel,
  professional: ProfessionalModel,
  role: RoleModel,
  service: ServiceModel,
  staff_member: StaffMemberModel,
  status: StatusModel,
  time_slot: TimeSlotModel,
  user: UserModel,
  payment: PaymentModel
} = models;

export { sequelize }
