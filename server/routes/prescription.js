require('../passport')
const express = require('express')
const passport = require('passport')
const { getPrescriptions, postPrescription } = require('../controllers/prescription')

const router = express.Router()

router.get('/', passport.authenticate('jwt', { session: false }), getPrescriptions)
router.post('/', passport.authenticate('jwt', { session: false }), postPrescription)

module.exports = router

