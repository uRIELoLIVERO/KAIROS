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
    service_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'service',
        key: 'id'
      }
    },
    staff_member_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'staff_member',
        key: 'id'
      }
    },
    custom_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    custom_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    custom_duration: {
      type: DataTypes.INTEGER,
      allowNull: true
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
