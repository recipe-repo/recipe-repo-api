var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Ingredient = require('./ingredient')
var Image = require('./image')

var RecipeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    images: [Image],
    sourceName: String,
    sourceUrl: String,
    ingredients: [Ingredient],
    instructions: [String],
    description: String,
    notes: String,
    prepTime: {
      type: Number,
      min: [0, 'negative time']
    },
    cookTime: {
      type: Number,
      min: [0, 'negative time']
    },
    servings: String,
    keywords: [String]
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
)

RecipeSchema.virtual('URISafeName').get(function () {
  return encodeURI(this.name)
})

RecipeSchema.virtual('totalTime').get(function () {
  return this.prepTime + this.cookTime
})

var Recipe = mongoose.model('Recipe', RecipeSchema)

module.exports = Recipe
