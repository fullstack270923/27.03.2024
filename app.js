const express = require('express')
const body_parser = require('body-parser')
const config = require('config')
const cors = require('cors')
const path = require('path')
const students_router = require('./routers/students_router')

const app = express()

app.use(body_parser.json())

app.use(cors())

app.use(express.static(path.join('.', '/static/')))

app.use('/api/students', students_router)

app.listen(config.server.port, () => {
    console.log(`====== express server is running on port ${config.server.port} =======`);
})