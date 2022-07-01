require('../passport')
const express = require('express')
const passport = require('passport')
const { getUsers } = require('../controllers/user')

const router = express.Router()

router.get('/', passport.authenticate('jwt', { session: false }), getUsers)

module.exports = router