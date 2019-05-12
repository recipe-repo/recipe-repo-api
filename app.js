require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./logs')

const bodyParser = require('body-parser')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var mongoose = require('mongoose')
const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PW,
  dbName: process.env.DATABASE_NAME,
  auth: { authdb: 'admin' }
}

mongoose.connect(process.env.DATABASE_HOST, mongooseOptions).then(
  () => { logger.info('Successfully connected to MongoDB') },
  err => { logger.error(err) }
)

const infoRouter = require('./routes/info.js')
app.use('/info', infoRouter)

const recipesRouter = require('./routes/recipes.js')
app.use('/recipes', recipesRouter)

const randomRouter = require('./routes/random.js')
app.use('/random', randomRouter)

var path = require('path')
app.use('/public/images', express.static(path.join(__dirname, process.env.IMAGE_DIR)))

app.listen(process.env.PORT, () => {
  logger.info({ 'config': { 'image-dir': process.env.IMAGE_DIR } }, 'server is now up')
})
