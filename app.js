// Initial module requirement setup
const pageInfo = require('./pageInfo');
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
var slugify = require('slugify');

/*************/
/* App Setup */
/*************/

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

/*******************************/
/* Mongoose/MongoDB Connection */
/*******************************/

const dbURI = process.env.MONGODB_URL;
mongoose.connect(dbURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

var db = mongoose.connection;
db.on('error', function (error) {
  console.log(`Connection Error: ${error.message}`)
});
db.once('open', function () {
  console.log('Connected to DB...');
});

// This will import the models so the name pair values match with the database
const ImGallery = require("./models/Galleries")

// To render the gallery page
app.get('/gallery', function (req, res) {
  ImGallery.find(function (err, result) {
    res.render('gallery', {
      gallery: result
    })
  })
})

// To render the gallery endpoint page
app.get('/gallery/:id', function (req, res) {
  ImGallery.find(function (err, result) {
    result.forEach(image => {
      let PId = Number(req.params.id)
      if (PId === image.id)
        res.render('image', {
          image
        })
    })
  })
})

// this function renders the home page
app.get('/', function (req, res) {
  res.render('index', pageInfo.index);
});

// when referencing url of images and stylesheets, public will be the root directory of the page.
app.use(express.static(path.join(__dirname, "public")))


app.use(function (req, res, next) {
  res.status(404);
  res.send('404: Image Not Found');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});