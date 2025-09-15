// index.js

const express = require('express')
const app = express()
require('dotenv').config()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const authRouter = require('./routes/auth.routes')
const userRouter = require('./routes/user.routes')
const formationRouter = require('./routes/formation.routes')
const briefingRouter = require('./routes/briefing.routes')
const notificationRouter = require('./routes/notification.routes')
// Middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

// Router for the API
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/formation', formationRouter)
app.use('/api/briefing', briefingRouter)
app.use('/api/notification', notificationRouter)

app.listen(8000)