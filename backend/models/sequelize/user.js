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
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "email"
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "phone_number"
    },
    password: {
      type: DataTypes.CHAR(60),
      allowNull: false
    },
    global_role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'global_role',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: true,
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
