'use strict';
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');

const { User } = require('../models');

exports.authenticateUser = async (req, res, next) => {
  const credentials = auth(req);
  let message;
  if (credentials) {
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name
      }
    });

    if (user) {
      const authenticated = bcrypt
        .compareSync(credentials.pass, user.password);

      if (authenticated) {
        req.currentUser = user;

      } else {
        message = `Authentication failed: ${user.emailAddress}`;
      }

    } else {
      message = `User not found: ${credentials.name}`;
    }

  } else {
    message = 'header not found';
  }

  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
}