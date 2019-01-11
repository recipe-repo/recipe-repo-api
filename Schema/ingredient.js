var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IngredientSchema = new Schema({
  name: { type: String, required: true},
  quantity: Number,
  unit: String,
  notes: String
});

module.exports = IngredientSchema;