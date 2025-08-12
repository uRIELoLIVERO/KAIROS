import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class payment extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      appointmentId: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        field: 'appointment_id',
        references: {
          model: 'appointment',
          key: 'id',
        }
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'payment_date'
      }
    }, {
      sequelize,
      tableName: 'payments',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
      paranoid: true,
      deletedAt: 'deleted_at',
    });
  }
}
