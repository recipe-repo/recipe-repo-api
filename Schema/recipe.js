var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Ingredient = require('./ingredient');

var RecipeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { data: Buffer, contentType: String },
    source_name: String,
    source_url: String,
    ingredients: [Ingredient],
    instructions: String,
    description: String,
    notes: String,
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

RecipeSchema.virtual('URISafeName').get(function () {
  return encodeURI(this.name)
});

var Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;