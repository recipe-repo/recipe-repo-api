const express = require('express');
var mongoose = require('mongoose');
const multer = require('multer');

var Recipe = require('../Schema/recipe');
const router = express.Router()

mongoose.connect('mongodb://'+process.env.DATABASE_HOST);


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
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
  //console.log(req);
  console.log(req.files)
 
  var recipe = new Recipe;
  recipe.name = req.body.name
  recipe.image.data = fs.readFileSync(req.files[0].destination + '/' +req.files[0].filename);
  recipe.image.contentType = 'image/png'

  recipe.ingredients = req.body.ingredients
  recipe.instructions = req.body.instructions
  recipe.source_name = req.body.source_name
  recipe.source_url = req.body.source_url

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