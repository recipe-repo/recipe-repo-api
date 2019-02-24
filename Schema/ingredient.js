var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IngredientSchema = new Schema({
  ingredient: { type: String, required: true},
  quantity: Number,
  unit: String,
  notes: String
});

module.exports = IngredientSchema;