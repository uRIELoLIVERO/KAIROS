import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _appointment from  "./appointment.js";
import _availability from  "./availability.js";
import _availability_day from  "./availability_day.js";
import _availability_exception from  "./availability_exception.js";
import _client from  "./client.js";
import _company from  "./company.js";
import _global_role from  "./global_role.js";
import _offered_service from  "./offered_service.js";
import _professional from  "./professional.js";
import _role from  "./role.js";
import _service from  "./service.js";
import _staff_member from  "./staff_member.js";
import _status from  "./status.js";
import _time_slot from  "./time_slot.js";
import _user from  "./user.js";

export default function initModels(sequelize) {
  const appointment = _appointment.init(sequelize, DataTypes);
  const availability = _availability.init(sequelize, DataTypes);
  const availability_day = _availability_day.init(sequelize, DataTypes);
  const availability_exception = _availability_exception.init(sequelize, DataTypes);
  const client = _client.init(sequelize, DataTypes);
  const company = _company.init(sequelize, DataTypes);
  const global_role = _global_role.init(sequelize, DataTypes);
  const offered_service = _offered_service.init(sequelize, DataTypes);
  const professional = _professional.init(sequelize, DataTypes);
  const role = _role.init(sequelize, DataTypes);
  const service = _service.init(sequelize, DataTypes);
  const staff_member = _staff_member.init(sequelize, DataTypes);
  const status = _status.init(sequelize, DataTypes);
  const time_slot = _time_slot.init(sequelize, DataTypes);
  const user = _user.init(sequelize, DataTypes);

  availability_day.belongsTo(availability, { foreignKey: "availability_id"});
  availability.hasMany(availability_day, { foreignKey: "availability_id"});
  staff_member.belongsTo(availability, { foreignKey: "availability_id"});
  availability.hasMany(staff_member, { foreignKey: "availability_id"});
  time_slot.belongsTo(availability_day, { foreignKey: "availability_day_id"});
  availability_day.hasMany(time_slot, { foreignKey: "availability_day_id"});
  staff_member.belongsTo(availability_exception, { foreignKey: "availability_exception_id"});
  availability_exception.hasMany(staff_member, { foreignKey: "availability_exception_id"});
  time_slot.belongsTo(availability_exception, { foreignKey: "availability_exception_id"});
  availability_exception.hasMany(time_slot, { foreignKey: "availability_exception_id"});
  appointment.belongsTo(client, { foreignKey: "client_id"});
  client.hasMany(appointment, { foreignKey: "client_id"});
  service.belongsTo(company, { foreignKey: "company_id"});
  company.hasMany(service, { foreignKey: "company_id"});
  staff_member.belongsTo(company, { foreignKey: "company_id"});
  company.hasMany(staff_member, { foreignKey: "company_id"});
  user.belongsTo(global_role, { foreignKey: "global_role_id"});
  global_role.hasMany(user, { foreignKey: "global_role_id"});
  appointment.belongsTo(offered_service, { foreignKey: "offered_service_id"});
  offered_service.hasMany(appointment, { foreignKey: "offered_service_id"});
  staff_member.belongsTo(professional, { foreignKey: "professional_id"});
  professional.hasMany(staff_member, { foreignKey: "professional_id"});
  staff_member.belongsTo(role, { foreignKey: "role_id"});
  role.hasMany(staff_member, { foreignKey: "role_id"});
  offered_service.belongsTo(service, { foreignKey: "service_id"});
  service.hasMany(offered_service, { foreignKey: "service_id"});
  offered_service.belongsTo(staff_member, { foreignKey: "staff_member_id"});
  staff_member.hasMany(offered_service, { foreignKey: "staff_member_id"});
  appointment.belongsTo(status, { foreignKey: "status_id"});
  status.hasMany(appointment, { foreignKey: "status_id"});
  professional.belongsTo(user, { foreignKey: "user_id"});
  user.hasMany(professional, { foreignKey: "user_id"});

  return {
    appointment,
    availability,
    availability_day,
    availability_exception,
    client,
    company,
    global_role,
    offered_service,
    professional,
    role,
    service,
    staff_member,
    status,
    time_slot,
    user,
  };
}
