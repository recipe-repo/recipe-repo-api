const express = require('express')
var mongoose = require('mongoose');

var Recipe = require('../Schema/recipe');
const router = express.Router()

mongoose.connect('mongodb://'+process.env.DATABASE_HOST);

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

router.post('/recipes', (req,res) => {
  const updated_recipe = req.body.recipe
 
  var recipe = new Recipe;
  recipe.name = updated_recipe.name
  recipe.ingredients = updated_recipe.ingredients
  recipe.instructions = updated_recipe.instructions
  recipe.source_name = updated_recipe.source_name
  recipe.source_url = updated_recipe.source_url

  // save the recipe
  recipe.save(function(err) {
    if (err) {
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