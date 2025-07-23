import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class availability_day extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dayOfWeek: {
      type: DataTypes.ENUM('MONDAY','TUESDAY','WEDNESDAY','THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'),
      allowNull: false,
      field: 'day_of_week'
    },
    availabilityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'availability_id',
      references: {
        model: 'availability',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'availability_day',
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
        name: "availability_id",
        using: "BTREE",
        fields: [
          { name: "availability_id" },
        ]
      },
    ]
  });
  }
}
