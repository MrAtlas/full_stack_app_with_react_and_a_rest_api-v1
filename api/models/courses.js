const Sequelize = require('sequelize');

module.exports = sequelize => {
  class Course extends Sequelize.Model { }
  Course.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Title is required'
          }, 
          notNull: {
            msg: "The course title CANNOT be NULL"
          }
        }
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Description is required'
          }, 
          notNull: {
            msg: "The course description CANNOT be NULL"
          }
        }
      },
      estimatedTime: {
        type: Sequelize.STRING
      },
      materialsNeeded: {
        type: Sequelize.STRING
      }
    },
    { sequelize }
  );

  Course.associate = models => {
    Course.belongsTo(models.User, {
      as: 'user',
      foreignKey: {
        fieldName: 'userId'
      }
    });
  };

  return Course;
};
