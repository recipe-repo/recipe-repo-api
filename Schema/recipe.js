var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecipeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  uri_safe_name: String,
  source_name: String,
  source_url: String,
  ingredients: String,
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

var Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;