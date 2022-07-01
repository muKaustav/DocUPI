require('dotenv').config()
require('./mongoDB/mongodb')
const cors = require('cors')
const express = require('express')
const passport = require('passport')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const prescriptionRoute = require('./routes/prescription')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the DocUPI Public API Subsystem',
        time: new Date().toLocaleString(),
        ip: req.ip
    })
})

app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/prescription', prescriptionRoute)

app.get('*', (req, res) => {
    res.redirect('/')
})

PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`)
})