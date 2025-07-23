import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class staff_member extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
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
    professionalId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      field: 'professional_id',
      references: {
        model: 'professional',
        key: 'id'
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'role_id',
      references: {
        model: 'role',
        key: 'id'
      }
    },
    availabilityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'availability_id',
      references: {
        model: 'availability',
        key: 'id'
      }
    },
    availabilityExceptionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'availability_exception_id',
      references: {
        model: 'availability_exception',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'staff_member',
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
        name: "company_id",
        using: "BTREE",
        fields: [
          { name: "company_id" },
        ]
      },
      {
        name: "professional_id",
        using: "BTREE",
        fields: [
          { name: "professional_id" },
        ]
      },
      {
        name: "role_id",
        using: "BTREE",
        fields: [
          { name: "role_id" },
        ]
      },
      {
        name: "availability_id",
        using: "BTREE",
        fields: [
          { name: "availability_id" },
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
