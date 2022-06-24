const bcrypt = require('bcrypt')
const moment = require('moment')
let { v4: uuid } = require('uuid')
const pool = require('../postgreSQL/pool')

let getUsers = async (req, res) => {
    pool.query('SELECT * FROM public."Users"', (err, results) => {
        if (err) {
            console.log(err)
            res.status(500).send(err)
        } else {
            console.log(results)
            res.status(200).send(results.rows)
        }
    })
}

let postUser = async (req, res) => {
    let { name, email, password, profile_picture, gender, age, specialization, refresh_token } = req.body
    let now = moment()

    pool.query('INSERT INTO public."Users" (user_id, name, email, password, profile_picture, gender, age, specialization, date_joined, refresh_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [uuid(), name, email, await bcrypt.hash(password, 10), profile_picture, gender, age, specialization, now.format('YYYY-MM-DD HH:mm:ss Z'), refresh_token],
        (err, results) => {
            if (err) {
                console.log(err)
                res.status(500).send(err)
            } else {
                console.log(results)
                res.status(201).send('User added.')
            }
        })
}

module.exports = { getUsers, postUser }

// {
//     "username":"kauc",
//     "name":"Kaustav M",
//     "email":"mu.kaustav@gmail.com",
//     "password":"ilovepizzza"
// }