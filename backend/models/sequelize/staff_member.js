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
    company_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'company',
        key: 'id'
      }
    },
    professional_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'professional',
        key: 'id'
      }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    availability_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'availability',
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
    tableName: 'staff_member',
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
