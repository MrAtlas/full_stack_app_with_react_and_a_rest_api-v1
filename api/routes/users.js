'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models').User;
const {authenticateUser} = require('../middleware/authUser');


function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}

// A /api/users GET route that will return the currently authenticated user along with a 200 HTTP status code.
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(200).json(user);
  }));
  
  
  // A /api/users POST route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
  router.post('/', asyncHandler(async (req, res) => {
    console.log(req.body);
    console.log(req.headers)
    try {
      await User.create(req.body);
      res.status(201).location('/').end();
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  }));
module.exports = router;