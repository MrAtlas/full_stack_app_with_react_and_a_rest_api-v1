'use strict';
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');


module.exports = sequelize => {
    class User extends Sequelize.Model { }
    User.init(
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            firstName: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "First Name is REQUIRED!"
                    },
                    notNull: {
                        msg: "First Name is required"
                    },
                }
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Last Name is REQUIRED!"
                    },
                    notNull: {
                        msg: "LAst Name is required"
                    },
                }
            },
            emailAddress: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: {
                    msg: "The email you entered already exists!"
                },
                validate: {
                    notEmpty: {
                        msg: "Email is REQUIRED!"
                    },
                    notNull: {
                        msg: "Email is required"
                    },
                    isEmail: {
                        msg: "Please provide a valid email address"
                    }
                }
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Password is REQUIRED!"
                    }, 
                    notNull: {
                        msg: "Password is required"
                    }
                },
                set(val) {
                    const hashedPassword = bcrypt.hashSync(val, 10);
                    this.setDataValue('password', hashedPassword);
                },
            }
        },
        { sequelize }
    );

    User.associate = models => {
        User.hasMany(models.Course, {
            as: 'courses',
            foreignKey: {
                fieldName: 'userId'
            }
        });
    };

    return User;
};
