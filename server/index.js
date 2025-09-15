// index.js

const express = require('express')
const app = express()
require('dotenv').config()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const authRouter = require('./routes/auth.routes')

// Middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

// Router for the API
app.use('/api/auth', authRouter)

app.listen(8000)