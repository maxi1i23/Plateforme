// index.js

const express = require('express')
const app = express()
require('dotenv').config()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

// Les liens pour les routes de l'API
const authRouter = require('./routes/auth.routes')
const userRouter = require('./routes/user.routes')
const formationRouter = require('./routes/formation.routes')
const briefingRouter = require('./routes/briefing.routes')
const notificationRouter = require('./routes/notification.routes')
const autreDemandeRouter = require('./routes/autreDemande.routes')
const demandeCongerRouter = require('./routes/demandeConger.routes')
const messageRouter = require('./routes/message.routes')
const activiterRouter = require('./routes/activiter.routes')

// Middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173", // front React
    credentials: true
 }));

// Router for the API
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/formation', formationRouter)
app.use('/api/briefing', briefingRouter)
app.use('/api/notification', notificationRouter)
app.use('/api/autreDemande', autreDemandeRouter)
app.use('/api/demandeConger', demandeCongerRouter)
app.use('/api/message', messageRouter)
app.use('/api/activiter',activiterRouter)

app.listen(8000)