import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class global_role extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.ENUM('ADMIN','PROFESSIONAL'),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'global_role',
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
    ]
  });
  }
}
