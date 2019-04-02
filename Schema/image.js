var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ImageSchema = new Schema(
  {
    path: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

module.exports = ImageSchema
