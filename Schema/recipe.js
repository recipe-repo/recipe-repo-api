var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Ingredient = require('./ingredient');

var RecipeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  uri_safe_name: String,
  image: { data: Buffer, contentType: String },
  source_name: String,
  source_url: String,
  ingredients: [Ingredient],
  instructions: String,
  description: String,
  notes: String,
  created_at: Date,
  updated_at: Date
});

RecipeSchema.pre('save', function(next) {

  this.uri_safe_name = encodeURI(this.name)
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

/**
 * Return a random recipe
 */
RecipeSchema.statics.random = function(callback) {
  this.estimatedDocumentCount(function(err, count) {
    if (err) {
      return callback(err);
    }
    const rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(callback);
  }.bind(this));
};

var Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;