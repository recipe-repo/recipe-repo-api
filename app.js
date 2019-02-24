require('dotenv').config();

const express = require('express')
const cors = require('cors');
const app = express()

const morgan = require('morgan')
app.use(morgan('short'))

const bodyParser = require('body-parser')
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const router = require("./routes/recipes.js")

app.use(router)

app.listen(3000, () => {
  console.log("server is now up")
})