const express = require('express')
const router = express.Router()
const logger = require('../logs')

const mongoose = require('mongoose')
const multer = require('multer')

var Recipe = require('../Schema/recipe')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/images/')
  },
  filename: function (req, file, cb) {
    cb(null, mongoose.Types.ObjectId().toString())
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }
}).any()

async function deleteImages (recipe, callback) {
  for (var i = 0; i < recipe.images.length; i++) {
    await deleteImage(recipe.id, recipe.images[i].name, () => {})
  }
  return callback()
}

async function deleteImage (recipeID, imageName, callback) {
  var fs = require('fs')
  fs.unlink(buildImagePath(recipeID, imageName), callback)
}

async function moveImage (source, destination, callback) {
  var fs = require('fs')
  var path = require('path')
  const parentDirectory = path.dirname(destination)
  fs.mkdir(parentDirectory, err => {
    if (err && err.code != 'EEXIST') {
      callback(err)
    }
    fs.copyFile(source, destination, (err) => {
      if (err) {
        callback(err)
      }
      fs.unlink(source, callback)
    })
  })
}

function buildImagePath (recipeId, imageName) {
  const imagePath = process.env.IMAGE_DIR + '/' + recipeId + '/' + imageName
  return imagePath
}

router.route('/')
  .get((req, res) => {
    logger.info('Fetching recipes')

    const searchObject = {}
    if (typeof req.query.name !== 'undefined') {
      searchObject['name'] = { '$regex': req.query.name, '$options': 'i' }
    }
    if (typeof req.query.source !== 'undefined') {
      searchObject['sourceName'] = req.query.source
    }

    Recipe.find(searchObject, function (err, recipes) {
      if (err) {
        logger.error(err)
        res.sendStatus(500)
      } else {
        res.json(recipes)
      }
    })
  })
  .post(upload, (req, res) => {
    const newRecipe = new Recipe(req.body)

    newRecipe.save(function (err, savedRecipe) {
      if (err) {
        logger.error(err)
        res.sendStatus(500)
      } else {
        logger.info('Recipe successfully saved!')
        res.json(savedRecipe)
      }
    })
  })

router.route('/:id')
  .get((req, res) => {
    logger.info('Fetching recipe with id: ' + req.params.id)

    Recipe.findById(req.params.id, function (err, recipe) {
      if (err) {
        res.sendStatus(500)
      } else {
        res.json(recipe)
      }
    })
  })
  .put(upload, (req, res) => {
    var newRecipe = req.body
    delete newRecipe._id
    delete newRecipe.images

    const matchIDQuery = { _id: { $eq: req.params.id } }
    Recipe.findOneAndUpdate(matchIDQuery, newRecipe, { runValidators: true }, (err, recipe) => {
      if (err) {
        logger.error(err)
        res.sendStatus(500)
      } else {
        logger.info(recipe.name + ' successfully updated!')
        res.json(recipe)
      }
    })
  })
  .delete((req, res) => {
    Recipe.findByIdAndDelete(req.params.id, function (err, recipe) {
      if (err) {
        logger.error(err)
        res.sendStatus(500)
      } else {
        logger.info(recipe.name + ' successfully deleted!')
        deleteImages(recipe, () => { logger.info('Deleted images from ' + recipe.name) })
        res.sendStatus(200)
      }
    })
  })

router.route('/:id/images')
  .post(upload, (req, res) => {
    const destination = buildImagePath(req.params.id, req.files[0].filename)

    const newImage = { name: req.files[0].filename }

    moveImage(req.files[0].path, destination, (err) => err ? logger.error(err) : null)
    Recipe.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { images: newImage } },
      function (err, recipe) {
        if (err) {
          res.sendStatus(500)
        } else {
          res.json(recipe)
        }
      }
    )
  })

router.route('/:id/images/:imageid')
  .get((req, res) => {
    const imagePath = '/' + buildImagePath(req.params.id, req.params.imageid)
    res.redirect(imagePath)
  })
  .delete((req, res) => {
    Recipe.findByIdAndUpdate(req.params.id, { $pull: { images: { name: req.params.imageid } } }, function (err, recipe) {
      if (err) {
        logger.error(err)
        res.sendStatus(500)
      } else {
        var fs = require('fs')
        fs.unlink(buildImagePath(req.params.id, req.params.imageid), (err) => err ? logger.error(err) : null)

        logger.info('image ' + req.params.imageid + ' successfully deleted!')
        res.sendStatus(200)
      }
    })
  })

module.exports = router
