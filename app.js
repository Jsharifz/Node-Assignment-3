// Initial module requirement setup
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
var slugify = require('slugify')

/*************/
/* App Setup */
/*************/

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');



/**************************/
/* Setup Early Middleware */
/**************************/

// Process POST form data from headers
app.use(express.urlencoded({ extended: false }));

// Set up global variables for navigation
app.use(function (request, response, next) {
  response.locals.currentIndex = '';
  response.locals.currentGalleries = '';
  next();
})


/*******************************/
/* Mongoose/MongoDB Connection */
/*******************************/

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Setup Mongo Client
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

// Import source data for insert
const images = require('./gallery.js');

// Setup server credentials securely
const uri = process.env.MONGODB_URL;

// Connect to MongoDB Atlas
// Notice that most of the code is inside a callback
MongoClient.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, function (err, client) {
  if (err) {
    console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
  }
  console.log('Connected...');

  // Choose our database
  const db = client.db("gallery");

  // Target our collection
  const imgCol = db.collection('images');

  // Drop the current collection, if there is any. The purpose of this script is to reset a test database to its default state.
  imgCol.deleteMany();
  console.log('Dropped');

  // Create a fresh collection using the custom module data
  imgCol.insertMany(images).then(function (cursor) {
    console.log(cursor.insertedCount);
    client.close()
  }).catch(function (err) {
    console.log(err);
  });
});


// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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


/**********************/
/* /definitions Route */
/**********************/

app.use('/definitions', require('./routes/images'));


// Import of our custom modules
const pageInfo = require('./pageInfo');
const gallery = require("./gallery");
app.locals.gallery = gallery; // to amke gallery accessible for views


app.get('/gallery/:id', function (req, res) { // start of gallery endpoint script

  // higher order funcion to catch/filter a specific object
  const findPhoto = function (myGallery, photoId) { // main function takes 2 vales, the module, and the id
    const index = myGallery.findIndex(function (gallery, index) {
      return gallery.id === photoId
    })
    return myGallery[index]
  }

  let PId = Number(req.params.id) // by default req.params.id returns a STRING, Number() ensures the string is converted to an int, otherwise findPhoto(gallery, PId) will return undefined as it expects a number vs a string

  let photoById = findPhoto(gallery, PId) // this variable accepts an object as a value when invoking the function findPhoto() with givin id of th photo

  // this function will generate an html page with given :id, it has the same structure as the other pages which allows us to therefore style the page. since photoById is an object with the specific id, dot notation will be used to fetch the specific name value pair of the object.

  // *********** REFER to gallery.ejs. The endpoint is linked from /gallery/ as the endpoint page is generated using the id of th image, only difference is the src="" links to the full size large image. The endpoint image page simply refers to the id of the image and therefore it is dynamicly generated.
  res.send(`

  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${photoById.title}</title> 
    <link rel="stylesheet" type="text/css" href="/css/main.css" media="screen" />
  </head>
  
  <body>
    <nav>
      <a href="/">Home</a>
      <a href="/gallery">Gallery</a>
    </nav>

    <main>
  <h1>${photoById.title}</h1>

    <figure id="endpoint">
      <img src="/images/lrg/${photoById.fileName}" alt="${photoById.title}" id="${PId}">
      <figcaption>${photoById.title}, by: <em><a href="${photoById.attribution.url}" target="_blank">${photoById.attribution.credit}</a></em> (${photoById.attribution.source})</figcaption>
    </figure>

    </main>
    <footer>Javad Sharifzadeh-Najafi - Web Dev 2020 - SAIT</footer>

</body>

</html>

  `);
}); // end of gallery endpoint script

// this function renders the home page
app.get('/', function (req, res) {
  res.render('index', pageInfo.index);
});

// this function renders the gallery page. It is only using pageInfo to generate the document tile.
app.get('/gallery', function (req, res) {
  res.render('gallery', pageInfo.gallery);
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