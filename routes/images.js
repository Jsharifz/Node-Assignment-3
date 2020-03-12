const express = require("express");
const route = express.Router();
const mongoose = require('mongoose');
const Gallery = require('../models/Galleries.js');
// Import model

const db = "mongodb+srv://jsharifz:330118@cluster0-jcdbr.mongodb.net/test?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
},
  function (err) {
    if (err) {
      console.error("Error! " + err);
    }
  })

route.get('/Galleries', function (req, res) {
  console.log('Get request for all images')
  Gallery.find({})
    .exec(function (err, Gallery) {
      if (err) {
        console.log("Err retrieving images")
      } else {
        res.json(Gallery)
      }
    })
})

console.log(Gallery)

// console.log(Gallery)

// // GET /gallery
// route.get('/:slug', async function (request, response) {
//   console.log('get /gallery');
//   try {
//     const image = await Image.findOne({ slug: request.params.slug });
//     response.render('gallery', gallery);

//   } catch (err) {
//     return res.status(500).send(err);
//   }
// });

// // POST /definitions
// route.post("/", function (request, response) {
//   console.log('post /gallery');
//   const image = new Image(request.body);

//   definition.save(function (err) {
//     if (err) throw err;
//     // TODO: Set flash message on success/error
//     response.redirect("/gallery");
//   });
// });


module.exports = route;