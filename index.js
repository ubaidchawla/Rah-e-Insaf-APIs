const express = require("express");
const app = express();
require('dotenv').config({path: __dirname + '/.env'})
const bodyParser = require('body-parser');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');
var routes = require('./routes/routes');
var cors = require('cors');
const port = process.env.PORT || 5000;
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
// Configuring the database
const dbConfig = require('./config/db.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(dbConfig.url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
    }).then(() => {
      console.log("Successfully connected to the database");
    }).catch(err => {
      console.log('Could not connect to the database.', err);
      process.exit();
});
require('./routes/controllers/auth')(passport); // pass passport for configuration
// set up our express application
app.use(cookieParser()); // read cookies (needed for auth)

app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(cors());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,DELETE,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    next();
});
// use it before all route definitions
app.use(cors({origin:[ 'http://localhost:5000/', 'http://localhost:8080/', 'http://rah-e-insaf-env.us-east-1.elasticbeanstalk.com/', 'https://tender-goldwasser-697d16.netlify.app/']}));

// required for passport
app.use(session({
  secret: 'fkjshdaurgtup',
  // name: 'cookie_name',
  // proxy: true,
  resave: false,
  saveUninitialized: false
})
);

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.get('/protected', (req, res) => {
  if (req.user) {
    res.send(`You are seeing this because you have a valid session.
    	Your id is ${req.user._id}.
    `)
  } else {
    res.status(401).send('Authrization failed! Please login');
  }
  
})

/*
4. Logout
=============
*/
app.all('/logout', (req, res) => {
  delete req.user; // any of these works
  	req.destroy(); // any of these works
    res.status(200).send('logout successful')
})


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes

app.use('/',routes);
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
