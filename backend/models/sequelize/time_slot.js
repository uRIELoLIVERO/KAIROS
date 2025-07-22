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
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    availability_day_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'availability_day',
        key: 'id'
      }
    },
    availability_exception_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'availability_exception',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'time_slot',
    timestamps: false,
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
