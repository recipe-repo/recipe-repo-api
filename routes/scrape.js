const express = require('express')
const router = express.Router()
const logger = require('../logs')

const { PythonShell } = require('python-shell')
const { parse } = require('recipe-ingredient-parser')

router.route('/')
  .get((req, res) => {
    if (typeof req.query.url !== 'undefined') {
      let options = {
        mode: 'json',
        scriptPath: 'python',
        pythonOptions: ['-u'], // get print results in real-time
        args: [req.query.url]
      }

      let pyshell = new PythonShell('scrape_recipe.py', options)
      var recipe

      pyshell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)

        recipe = JSON.parse(JSON.stringify(message))

        // Parse ingredients
        recipe.ingredients = []
        message.ingredients.forEach(element => {
          var segmentedIngredients = parse(element)
          recipe.ingredients.push(segmentedIngredients)
        })

        recipe.instructions = message.instructions.split('\n')
        if (recipe.instructions[recipe.instructions.length - 1] === '') {
          recipe.instructions.pop()
        }
      })

      // end the input stream and allow the process to exit
      pyshell.end(function (err, code, signal) {
        if (err) {
          logger.error(err)
          throw err
        }
        res.json(recipe)
      })
    } else {
      res.sendStatus(500)
    }
  })

module.exports = router
