const express = require('express')
const router = express.Router()
const logger = require('../logs')

var Recipe = require('../Schema/recipe')

router.get('/', (req, res) => {
  res.redirect('/random/1')
})

router.get('/:number', (req, res) => {
  logger.info('Fetching random recipes')

  const numberOfRecipes = parseInt(req.params.number, 10)

  Recipe.aggregate([{ $sample: { size: numberOfRecipes } }], (err, result) => {
    if (err) {
      logger.error(err)
      res.sendStatus(500)
    } else {
      res.json(result)
    }
  })
})

module.exports = router
