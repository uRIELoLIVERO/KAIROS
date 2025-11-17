import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class company_working_hours extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    companyId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      field: 'company_id',
      references: {
        model: 'company',
        key: 'id'
      }
    },
    dayOfWeek: {
      type: DataTypes.ENUM('MONDAY','TUESDAY','WEDNESDAY','THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'),
      allowNull: false,
      field: 'day_of_week'
    },
    openingTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'opening_time'
    },
    closingTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'closing_time'
    }
  }, {
    sequelize,
    tableName: 'company_working_hours',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
