const express = require('express')
const { getUsers, postUser } = require('../controllers/user')

const router = express.Router()

router.get('/', getUsers)
router.post('/', postUser)

module.exports = router