const express = require('express')
const { getPrescriptions, postPrescription } = require('../controllers/prescription')

const router = express.Router()

router.get('/', getPrescriptions)
router.post('/', postPrescription)

module.exports = router

