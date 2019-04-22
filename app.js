require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()

const morgan = require('morgan')
app.use(morgan('short'))

const bodyParser = require('body-parser')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var mongoose = require('mongoose')
const mongooseOptions = {
  useNewUrlParser: true,
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PW,
  dbName: process.env.DATABASE_NAME,
  auth: { authdb: 'admin' }
}

mongoose.connect(process.env.DATABASE_HOST, mongooseOptions).then(
  () => { console.log('Successfully connected to MongoDB') },
  err => { console.log(err) }
)

const recipesRouter = require('./routes/recipes.js')
app.use('/recipes', recipesRouter)

const randomRouter = require('./routes/random.js')
app.use('/random', randomRouter)

var path = require('path')
app.use('/public/images', express.static(path.join(__dirname, process.env.IMAGE_DIR)))

app.listen(process.env.PORT, () => {
  console.log('images in ' + process.env.IMAGE_DIR)
  console.log('server is now up')
})
