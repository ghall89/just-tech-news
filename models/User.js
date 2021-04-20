const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create user model
class User extends Model {
	checkPassword(loginPw) {
		return bcrypt.compareSync(loginPw, this.password);
	}
}

// define table columns and config
User.init(
	{	
		// table column definitions here
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [4]
			}
		}
	},
	{
		hooks: {
		// 	beforeCreate(userData) {
		// 		return bcrypt.has(userData.password, 10).then(newUserData => {
		// 			return newUserData
		// 		});
		// 	}
		// This does the same thing as the code above ⇧⇧⇧
			async beforeCreate(newUserData) {
				newUserData.password = await bcrypt.hash(newUserData.password, 10);
				return newUserData;
			},
			async beforeUpdate(updatedUserData) {
				updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
				return updatedUserData;
			}
		},
		
		// table config options here  (https://sequelize.org/v5/manual/models-definition.html#configuration)
		sequelize,
		timestamps: false,
		freezeTableName: true,
		underscored: true,
		modelName: 'user'
	}
);

module.exports = User;