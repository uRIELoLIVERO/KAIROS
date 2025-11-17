import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class time_slot extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'start_time'
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'end_time'
    },
    availabilityDayId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'availability_day_id',
      references: {
        model: 'availability_day',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'time_slot',
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
      {
        name: "availability_day_id",
        using: "BTREE",
        fields: [
          { name: "availability_day_id" },
        ]
      },
      {
        name: "availability_exception_id",
        using: "BTREE",
        fields: [
          { name: "availability_exception_id" },
        ]
      },
    ]
  });
  }
}
