const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path=require('path');
var bodyParser = require("body-parser");
const session = require('express-session');


const app = express();
require('./config/passport')(passport);
app.use(bodyParser.urlencoded({ extended: false }));


const dbPort = process.env.DB_PORT || 27017;
const dbUrl = process.env.MONGO_NAME || "localhost";
const dbCollection = process.env.DB_COLLECTION || "passport";
mongoose.connect(`mongodb://${dbUrl}/${dbCollection}`, {useNewUrlParser: true})
    .then(_ => console.log('MongoDB connection success'))
.catch(err => console.error(err));
mongoose.set('useCreateIndex', true);

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','html');
app.engine('html', require('ejs').renderFile);

app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
