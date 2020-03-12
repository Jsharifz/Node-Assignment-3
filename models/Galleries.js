const mongoose = require('mongoose');

// Step 1: Define our Schema
// See: https://mongoosejs.com/docs/guide.html
/*
"Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection."
*/

const Schema = mongoose.Schema;

const gallerySchema = new Schema(

  {
    _id: String,
    id: Number,
    title: String,
    fileName: String,
    attribution: {
      source: String,
      credit: String,
      url: String
    }

  }

);

// Compile and export our model using the above Schema.
// See: https://mongoosejs.com/docs/models.html 

module.exports = mongoose.model('Gallery', gallerySchema, 'images');
// Important: The first argument of mongoose.model() is the singular name of the collection your model is for.
// ** Mongoose automatically looks for the plural, lowercased version of your model name. **"
// In our example, we name our model 'Definition' and mongoose will automatically look for the collection 'definitions' 