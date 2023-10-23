'use strict';

const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
const {authenticateUser} = require('../middleware/authUser');

/*
A /api/courses GET route that will return all courses including the User associated with each course and a 200 HTTP status code.
A /api/courses/:id GET route that will return the corresponding course including the User associated with that course and a 200 HTTP status code.
A /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
A /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
A /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
Test your routes

*/

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}

//A /api/courses GET route that will return all courses including the User associated with each course and a 200 HTTP status code.
//resources: https://stackoverflow.com/questions/64799742/sequelize-error-you-must-use-the-as-keyword-to-specify-the-alias-of-the-assoc

router.get('/', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        include: [{ model: User, as: 'user' }],
    });
  
    if (courses) {
      res.status(200).json(courses);
    } else {
      res.status(404).json({ message: "No course FOUND!" });
    }
  }));

 //A /api/courses/:id GET route that will return the corresponding course including the User associated with that course and a 200 HTTP status code.

  router.get('/:id', asyncHandler(async (req, res) => {
    const courses = await Course.findByPk(req.params.id, {
        include: [{ model: User, as: 'user' }],
      });
  
    if (courses) {
      res.status(200).json(courses);
    } else {
      res.status(404).json({ message: "No course FOUND!" });
    }
  }));


//A /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
//resources: https://www.appsloveworld.com/nodejs/100/14/how-to-set-the-location-response-http-header-in-express-framework
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
    try {
      const course = await Course.create(req.body);
      res.status(201).location(`/api/courses/${course.id}`).end();
    } catch (error) {
      console.log('ERROR: ', error.name);
  
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  }));

//A /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.

router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {

      const course = await Course.findByPk(req.params.id);
  
      if (course) {
        await course.update({
          title: req.body.title,
          description: req.body.description,
          estimatedTime: req.body.estimatedTime,
          materialsNeeded: req.body.materialsNeeded,
          userId: req.body.userId
        });
  
        res.status(204).end();
      } else {
        res.status(404).json({ message: "No course FOUND!" });
      }
    } catch (error) {
      console.log('ERROR: ', error.name);
  
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  }));

  //A /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
  router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
  
    if (course) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: "No course FOUND!" });
    }
  }));


//I spent hours trying to figure out why i was getting this error 
//throw new TypeError('Router.use() requires a middleware function but got a ' + gettype(fn))
//it was because I forgot to export the router :(
//credits: https://stackoverflow.com/questions/27465850/typeerror-router-use-requires-middleware-function-but-got-a-object
module.exports = router;