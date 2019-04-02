const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const multer = require('multer')

var Recipe = require('../Schema/recipe')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now())
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }
}).any()

function extractRecipe (request) {
  const body = request.body
  var recipe = new Recipe()
  recipe.name = body.name
  recipe.ingredients = JSON.parse(body.ingredients)
  recipe.instructions = body.instructions
  recipe.sourceName = body.sourceName
  recipe.sourceUrl = body.sourceUrl

  const files = request.files
  if (files && files.length !== 0) {
    var image = { path: 'public/images/' + mongoose.Types.ObjectId() }
    recipe.image = image
  }

  return recipe
}

async function deleteImage (recipe, callback) {
  if (typeof recipe.image !== 'undefined') {
    var fs = require('fs')
    fs.unlink(recipe.image.path, callback)
  }
}

router.route('/')
  .get((req, res) => {
    console.log('Fetching recipes')

    Recipe.find({}, function (err, recipes) {
      if (err) {
        res.sendStatus(500)
      } else {
        res.json(recipes)
      }
    })
  })
  .post(upload, (req, res) => {
    const newRecipe = extractRecipe(req)

    newRecipe.save(function (err, savedRecipe) {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        console.log('Recipe successfully saved!')
        res.json(savedRecipe)

        if (typeof newRecipe.image !== 'undefined') {
          var fs = require('fs')
          fs.rename(req.files[0].path, savedRecipe.image.path, (err) => err ? console.log('Error moving file') : null)
        }
      }
    })
  })

router.route('/:id')
  .get((req, res) => {
    console.log('Fetching recipe with id: ' + req.params.id)

    Recipe.findById(req.params.id, function (err, recipe) {
      if (err) {
        res.sendStatus(500)
      } else {
        res.json(recipe)
      }
    })
  })
  .put(upload, (req, res) => {
    var newRecipe = extractRecipe(req).toObject()
    delete newRecipe._id

    const matchIDQuery = { _id: { $eq: req.params.id } }
    Recipe.findOneAndUpdate(matchIDQuery, newRecipe, (err, recipe) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        console.log(recipe.name + ' successfully updated!')
        res.sendStatus(200)

        var fs = require('fs')
        if (typeof newRecipe.image !== 'undefined') {
          fs.rename(req.files[0].path, newRecipe.image.path, (err) => err ? console.log('Error moving file') : null)

          deleteImage(recipe)
        }
      }
    })
  })
  .delete((req, res) => {
    Recipe.findByIdAndDelete(req.params.id, function (err, recipe) {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        deleteImage(recipe)

        console.log(recipe.name + ' successfully deleted!')
        res.sendStatus(200)
      }
    })
  })

module.exports = router
