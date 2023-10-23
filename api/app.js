'use strict';

// Load modules
const express = require('express');
const morgan = require('morgan');
const { Sequelize } = require('sequelize');

var cors = require('cors')

var bodyParser = require('body-parser');

// Variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Create a new Sequelize instance with the database configuration
const config = require('./config/config.json');
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password, {
  host: config.development.host,
  dialect: config.development.dialect,
});

// Testing the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection successful!');
    startServer();
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Create the Express app
const app = express();

//enables CORS
app.use(cors())

// Import the route handlers for users and courses
const routesUsers = require('./routes/users');
const routesCourses = require('./routes/courses');

//I was having always the same error, even though I created the JSON user or course, I was getting an empty req.body, 
// so after a research I found this resource
//https://stackoverflow.com/questions/31967138/node-js-express-js-bodyparser-post-limit
app.use(bodyParser.json({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}));


// Setup request logging
app.use(morgan('dev'));

// A friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Use the route handlers for users and courses
app.use('/api/users', routesUsers);
app.use('/api/courses', routesCourses);

// Send a 404 response if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// Set the port
app.set('port', process.env.PORT || 5000);

// Function to start the Express server
function startServer() {
  const server = app.listen(app.get('port'), () => {
    console.log(`Express server is listening on port ${server.address().port}`);
  });
}

