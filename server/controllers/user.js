const bcrypt = require('bcrypt')
const pool = require('../postgreSQL/pool')

let getUsers = async (req, res) => {
    pool.query('SELECT * FROM "user"', (err, results) => {
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
    let { username, name, email, password } = req.body

    pool.query('INSERT INTO "user" (username, name, email, password) VALUES ($1, $2, $3, $4)',
        [username, name, email, await bcrypt.hash(password, 10)],
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