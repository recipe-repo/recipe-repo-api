const express = require('express');
var mongoose = require('mongoose');
const multer = require('multer');

var Recipe = require('../Schema/recipe');
const router = express.Router()

mongoose.connect('mongodb://' + process.env.DATABASE_HOST);

var storage = multer.memoryStorage()
 
const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000},
}).any();

router.get('/recipes', (req, res) => {
  console.log("Fetching recipes")
  
  Recipe.find({}, function(err, recipes) {
    if (err) {
      res.sendStatus(500)
      return
    }
 
    // object of all the recipes
    res.json(recipes)
  });
})

router.get('/recipes/:id', (req, res) => {
  console.log("Fetching recipe with id: " + req.params.id)
  
  Recipe.findById(req.params.id, function(err, recipe) {
    if (err) {
      res.sendStatus(500)
      return
    }
    // object of the user
    res.json(recipe)
  });
})

router.post('/recipes', upload, (req,res) => {
 
  var recipe = new Recipe;
  recipe.name = req.body.name
  recipe.ingredients = req.body.ingredients
  recipe.instructions = req.body.instructions
  recipe.source_name = req.body.source_name
  recipe.source_url = req.body.source_url

  recipe.image.data = req.files[0].buffer
  recipe.image.contentType = req.files[0].mimetype

  // save the recipe
  recipe.save(function(err) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return
    }
    else{
      console.log('Recipe successfully updated!');
      res.sendStatus(200);
    }
  });

});

module.exports = router