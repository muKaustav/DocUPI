const moment = require('moment')
const PrescriptionSchema = require('../models/prescriptionModel')

let getPrescriptions = async (req, res) => {

    try {
        PrescriptionSchema.find({}, (err, prescriptions) => {
            if (err) {
                console.log(err)
                res.status(500).send(err)
            } else {
                console.log(prescriptions)

                return res.status(200).send({
                    success: true,
                    result: prescriptions
                })
            }
        })
    } catch (err) {
        console.log(err)

        return res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            error: err
        })
    }
}

let postPrescription = async (req, res) => {

    let { userId, specialization, prescription_url } = req.body
    let now = moment()
    let date_issued = now.format('YYYY-MM-DD HH:mm:ss Z')
    // fix specialization nesting
    try {
        let oldPrescription = await PrescriptionSchema.findOne({ userId })

        if (oldPrescription) {
            let newPrescription = await PrescriptionSchema.findOneAndUpdate({ userId }, {
                $push: {
                    prescriptions: {
                        specialization,
                        specializationSpecificPrescription: {
                            date_issued,
                            prescription_url
                        }
                    }
                }
            }, { new: true })

            return res.status(200).send({
                success: true,
                result: newPrescription
            })
        } else {
            let newPrescription = await PrescriptionSchema.create({
                userId,
                prescriptions: [{
                    specialization,
                    specializationSpecificPrescription: {
                        date_issued,
                        prescription_url
                    }
                }]
            })

            return res.status(200).send({
                success: true,
                result: newPrescription
            })
        }
    } catch (err) {
        console.log(err)

        return res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            error: err
        })
    }
}

module.exports = { getPrescriptions, postPrescription }