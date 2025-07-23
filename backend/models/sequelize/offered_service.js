import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class offered_service extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    serviceId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      field: 'service_id',
      references: {
        model: 'service',
        key: 'id'
      }
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
    customDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'custom_description'
    },
    customPrice: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      field: 'custom_price'
    },
    customDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'custom_duration'
    }
  }, {
    sequelize,
    tableName: 'offered_service',
    timestamps: false,
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at',
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
        name: "service_id",
        using: "BTREE",
        fields: [
          { name: "service_id" },
        ]
      },
      {
        name: "staff_member_id",
        using: "BTREE",
        fields: [
          { name: "staff_member_id" },
        ]
      },
    ]
  });
  }
}
