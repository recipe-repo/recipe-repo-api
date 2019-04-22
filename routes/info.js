const express = require('express')
const router = express.Router()

router.route('/')
  .get((req, res) => {
    const response = { version: '0.2.0' }
    res.json(response)
  })

module.exports = router
