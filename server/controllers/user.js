const bcrypt = require('bcrypt')
const moment = require('moment')
let { v4: uuid } = require('uuid')
const pool = require('../postgreSQL/pool')

let getUsers = async (req, res) => {
    pool.query('SELECT * FROM public."Users"').then(result => {
        console.log(result)

        return res.status(200).send({
            success: true,
            result: result.rows
        })
    }).catch(err => {
        console.log(err)

        return res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            error: err
        })
    })
}

module.exports = { getUsers }

// {
//     "username":"kauc",
//     "name":"Kaustav M",
//     "email":"mu.kaustav@gmail.com",
//     "password":"ilovepizzza"
// }