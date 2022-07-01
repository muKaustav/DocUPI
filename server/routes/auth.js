require('../passport')
const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const router = express.Router()

router.get('/google', passport.authenticate('google', {
    session: false,
    scope: ["profile", "email"],
    accessType: "offline",
    approvalPrompt: "force"
}))

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    let token = jwt.sign({ user_id: req.user.user_id, name: req.user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })

    return res.status(200).send({
        success: true,
        message: 'User logged in successfully.',
        user: {
            user_id: req.user.user_id,
            name: req.user.name,
            profile_picture: req.user.profile_picture,
        },
        accessToken: "Bearer " + token,
        refreshToken: req.user.refresh_token
    })
})

module.exports = router