const express = require('express')
const router = express.Router()
var mongoose = require('mongoose')

router.route('/')
  .get((req, res) => {
    const response = {
      api_version: '0.2.0',
      db_url: process.env.DATABASE_HOST,
      connected_to_db: mongoose.connection.readyState
    }
    res.json(response)
  })

module.exports = router
