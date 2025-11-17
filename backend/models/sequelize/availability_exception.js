import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class availability_exception extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_available'
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    staffMemberId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      field: 'staff_member_id',
      references: {
        model: 'staff_member',
        key: 'id'
      }
    },
    startDatetime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_datetime'
    },
    endDatetime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_datetime'
    }
  }, {
    sequelize,
    tableName: 'availability_exception',
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
