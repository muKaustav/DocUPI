require('dotenv').config()
const moment = require('moment')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const { v4: uuid } = require('uuid')
const JwtStrategy = require('passport-jwt').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy
const { fromAuthHeaderAsBearerToken } = require('passport-jwt').ExtractJwt
const pool = require('./postgreSQL/pool')

let opts = {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
}

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    pool.query('SELECT * FROM public."Users" WHERE user_id = $1', [jwt_payload.user_id], (err, result) => {
        if (err) return done(err, false)

        if (result.rows.length === 0) return done(null, false)

        return done(null, result.rows[0])
    })
}))

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true
},
    (request, accessToken, refreshToken, profile, done) => {
        let now = moment()

        pool.query('SELECT * FROM public."Users" WHERE google_id = $1 OR email = $2', [profile.id, profile.emails[0].value], (err, result) => {
            if (err) return done(err, false)

            if (result.rows.length === 0) {
                let user_id = uuid()
                let refresh_token = jwt.sign({ user_id: user_id, name: profile.displayName }, process.env.ACCESS_TOKEN_SECRET)

                pool.query('INSERT INTO public."Users" (user_id, name, email, profile_picture, google_id, refresh_token, date_joined) VALUES ($1, $2, $3, $4, $5, $6, $7)', [user_id, profile.displayName, profile.emails[0].value, profile.photos[0].value, profile.id, refresh_token, now], (err, result) => {
                    if (err) return done(err, false)

                    return done(null, result.rows[0])
                })
            } else {
                pool.query('UPDATE public."Users" SET profile_picture = $1 WHERE google_id = $2 OR email = $3', [profile.photos[0].value, profile.id, profile.emails[0].value], (err, result) => {
                    if (err) return done(err, false)

                    return done(null, result.rows[0])
                })
            }

            return done(null, result.rows[0])
        })
    }
))

let googleAuthCallback = () => {
    passport.authenticate('google', { session: false }), (req, res) => {
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
    }
}

module.exports = { googleAuthCallback }