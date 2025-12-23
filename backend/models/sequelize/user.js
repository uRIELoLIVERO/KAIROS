import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class user extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'last_name'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "email"
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "phone_number",
      field: 'phone_number'
    },
    password: {
      type: DataTypes.CHAR(60),
      allowNull: false
    },
    globalRoleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'global_role_id',
      references: {
        model: 'global_role',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'user',
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
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "phone_number",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "phone_number" },
        ]
      },
      {
        name: "global_role_id",
        using: "BTREE",
        fields: [
          { name: "global_role_id" },
        ]
      },
    ]
  });
  }
}
