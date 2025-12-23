import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _appointment from "./appointment.js";
import _availability from "./availability.js";
import _availability_day from "./availability_day.js";
import _availability_exception from "./availability_exception.js";
import _client from "./client.js";
import _company from "./company.js";
import _global_role from "./global_role.js";
import _offered_service from "./offered_service.js";
import _professional from "./professional.js";
import _role from "./role.js";
import _service from "./service.js";
import _staff_member from "./staff_member.js";
import _status from "./status.js";
import _time_slot from "./time_slot.js";
import _user from "./user.js";
import _payment from "./payment.js";
import _company_working_hours from "./company_working_hours.js";

export default function initModels(sequelize) {
  // Inicialización de modelos
  const appointment = _appointment.init(sequelize, DataTypes);
  const availability = _availability.init(sequelize, DataTypes);
  const availability_day = _availability_day.init(sequelize, DataTypes);
  const availability_exception = _availability_exception.init(sequelize, DataTypes);
  const client = _client.init(sequelize, DataTypes);
  const company = _company.init(sequelize, DataTypes);
  const company_working_hours = _company_working_hours.init(sequelize, DataTypes);
  const global_role = _global_role.init(sequelize, DataTypes);
  const offered_service = _offered_service.init(sequelize, DataTypes);
  const professional = _professional.init(sequelize, DataTypes);
  const role = _role.init(sequelize, DataTypes);
  const service = _service.init(sequelize, DataTypes);
  const staff_member = _staff_member.init(sequelize, DataTypes);
  const status = _status.init(sequelize, DataTypes);
  const time_slot = _time_slot.init(sequelize, DataTypes);
  const user = _user.init(sequelize, DataTypes);
  const payment = _payment.init(sequelize, DataTypes);

  availability_day.belongsTo(availability, { foreignKey: "availabilityId"});
  availability.hasMany(availability_day, { foreignKey: "availabilityId"});
  
  staff_member.belongsTo(availability, { foreignKey: "availabilityId"});
  availability.hasMany(staff_member, { foreignKey: "availabilityId"});
  
  time_slot.belongsTo(availability_day, { foreignKey: "availabilityDayId"});
  availability_day.hasMany(time_slot, { foreignKey: "availabilityDayId"});

  time_slot.belongsTo(availability_exception, { foreignKey: "availabilityExceptionId"});
  availability_exception.hasMany(time_slot, { foreignKey: "availabilityExceptionId"});
  
  staff_member.belongsTo(availability_exception, { foreignKey: "availabilityExceptionId"});
  availability_exception.hasMany(staff_member, { foreignKey: "availabilityExceptionId"});
  
  appointment.belongsTo(client, {
    foreignKey: {
      name: "clientId",
      allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  });
  client.hasMany(appointment, { foreignKey: "clientId"});
  
  service.belongsTo(company, { foreignKey: "companyId"});
  company.hasMany(service, { foreignKey: "companyId"});
  
  staff_member.belongsTo(company, {
    foreignKey: {
      name: "companyId",
      allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  });
  company.hasMany(staff_member, { foreignKey: "companyId"});
  
  user.belongsTo(global_role, { foreignKey: "globalRoleId"});
  global_role.hasMany(user, { foreignKey: "globalRoleId"});
  
  appointment.belongsTo(offered_service, {
    foreignKey: {
      name: "offeredServiceId",
      allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  });
  offered_service.hasMany(appointment, { foreignKey: "offeredServiceId"});
  
  staff_member.belongsTo(professional, {
    foreignKey: {
      name: "professionalId",
      allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  });
  professional.hasMany(staff_member, { foreignKey: "professionalId"});
  
  staff_member.belongsTo(role, {
    foreignKey: {
      name: "roleId",
      allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  });
  role.hasMany(staff_member, { foreignKey: "roleId"});
  
  offered_service.belongsTo(service, {
    foreignKey: {
      name: "serviceId",
      allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  });
  service.hasMany(offered_service, { foreignKey: "serviceId"});
  
  offered_service.belongsTo(staff_member, {
    foreignKey: {
      name: "staffMemberId",
      allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  });
  staff_member.hasMany(offered_service, { foreignKey: "staffMemberId"});
  
  appointment.belongsTo(status, {
    foreignKey: {
      name: "statusId",
      allowNull: false
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  });
  status.hasMany(appointment, { foreignKey: "statusId"});
  
  professional.belongsTo(user, {
    foreignKey: {
      name: "userId",
      allowNull: false
    },
    onDelete: "CASCADE", 
    onUpdate: "CASCADE"
  });
  user.hasMany(professional, { foreignKey: "userId"});
  
  payment.belongsTo(appointment, { foreignKey: "appointmentId" });
  appointment.hasMany(payment, { foreignKey: "appointmentId" });

  company_working_hours.belongsTo(company, { foreignKey: "companyId" });
  company.hasMany(company_working_hours, { foreignKey: "companyId" });

  return {
    appointment,
    availability,
    availability_day,
    availability_exception,
    client,
    company,
    company_working_hours,
    global_role,
    offered_service,
    professional,
    role,
    service,
    staff_member,
    status,
    time_slot,
    user,
    payment,
  };
}