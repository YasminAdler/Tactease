const express = require('express')
const logger = require('morgan')
const app = express()
const port = process.env.PORT || 3000
const { missionsRouter } = require('/router/missionRouter')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/missions', missionsRouter)
app.use(logger('dev'))

app.listen(port, () => console.log(`Express server is running on port ${port}`))