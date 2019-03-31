const express = require('express');
var mongoose = require('mongoose');
const multer = require('multer');

var Recipe = require('../Schema/recipe');
const router = express.Router()

const mongoose_options = {
  useNewUrlParser: true,
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PW,
  dbName: process.env.DATABASE_NAME,
  auth:{authdb:"admin"}
}
mongoose.connect(process.env.DATABASE_HOST, mongoose_options).then(
  () => { console.log("Successfully connected to MongoDB") },
  err => { console.log(err) }
);

var storage = multer.memoryStorage()
 
const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000},
}).any();

function extractRecipe(body, files){
  var recipe = new Recipe;
  recipe.name = body.name
  recipe.ingredients = JSON.parse(body.ingredients)
  recipe.instructions = body.instructions
  recipe.sourceName = body.sourceName
  recipe.sourceUrl = body.sourceUrl

  if (files && files.length !== 0) {
    recipe.image.data = files[0].buffer
    recipe.image.contentType = files[0].mimetype
  }
  return recipe
}


router.route('/recipes') 
  .get((req, res) => {
    console.log("Fetching recipes")
    
    Recipe.find({}, function(err, recipes) {
      if (err) {
        res.sendStatus(500)
      } else {
        res.json(recipes)
      }
    })
  })
  .post(upload, (req, res) => {
    const newRecipe = extractRecipe(req.body, req.files)

    newRecipe.save(function (err, savedRecipe) {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        console.log('Recipe successfully saved!')
        res.json(savedRecipe)
      }
    })
  })

router.route('/recipes/:id')
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
    var newRecipe = extractRecipe(req.body, req.files).toObject()
    delete newRecipe._id

    Recipe.findOneAndReplace({ _id: { $eq: req.params.id } }, newRecipe, (err, recipe) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        console.log(recipe.name + ' successfully updated!')
        res.sendStatus(200)
      }
    })
  })
  .delete((req, res) => {
    Recipe.findByIdAndDelete(req.params.id, function (err, recipe) {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        console.log(recipe.name + ' successfully deleted!')
        res.sendStatus(200)
      }
    })
  })

router.get('/random', (req, res) => {
  res.redirect('/random/1')
})

router.get('/random/:number', (req, res) => {
  console.log("Fetching random recipes")
  
  const numberOfRecipes = parseInt(req.params.number, 10);

  Recipe.aggregate([{ $sample: { size: numberOfRecipes } }], (err, result) => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.json(result);
    }
  });
})

module.exports = router