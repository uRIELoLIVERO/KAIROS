import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class appointment extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    appointmentDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'appointment_date_time'
    },
    offeredServiceId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      field: 'offered_service_id',
      references: {
        model: 'offered_service',
        key: 'id'
      }
    },
    clientId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      field: 'client_id',
      references: {
        model: 'client',
        key: 'id'
      }
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'status_id',
      references: {
        model: 'status',
        key: 'id'
      }
    },
    canceledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'canceled_at'
    }
  }, {
    sequelize,
    tableName: 'appointment',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
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
        name: "offered_service_id",
        using: "BTREE",
        fields: [
          { name: "offered_service_id" },
        ]
      },
      {
        name: "client_id",
        using: "BTREE",
        fields: [
          { name: "client_id" },
        ]
      },
      {
        name: "status_id",
        using: "BTREE",
        fields: [
          { name: "status_id" },
        ]
      },
    ]
  });
  }
}
