const Newsletter = require("../models/Newsletter")
const mailer = require("../mailer/index")

async function createRecord(req, res) {
    try {
        let data = new Newsletter(req.body)
        await data.save()

        try {
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: `Subscribed to Newsletter - ${process.env.SITE_NAME}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #ffffff;">
                        <h3 style="color: #0d6efd; text-align: center;">Welcome to Our Newsletter!</h3>
                        <p>Thank you for subscribing to the <strong>${process.env.SITE_NAME}</strong> newsletter.</p>
                        <p>You will now receive weekly tech updates, career opportunities, and industry insights directly in your inbox.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 13px; color: #888; text-align: center;">Best regards,<br/><strong>Team ${process.env.SITE_NAME}</strong></p>
                    </div>
                `
            }, (err) => {
                if (err) console.log("Newsletter email send failed:", err);
            });
        } catch (e) {
            console.error("Newsletter email error:", e);
        }

        res.send({
            result: "Done",
            data: data,
            message:"Thanks to Subscribe Our Newsletter Service"
        })
    } catch (error) {
        let errorMessage = {}
        error.keyValue ? errorMessage.email = "Your Email Address is Already Registered With Us" : null
        error.errors?.email ? errorMessage.email = error.errors.email.message : null

        if (Object.values(errorMessage).length === 0) {
            res.status(500).send({
                result: "Fail",
                reason: "Internal Server Error"
            })
        }
        else {
            res.status(400).send({
                result: "Fail",
                reason: errorMessage
            })
        }
    }
}

async function getRecord(req, res) {
    try {
        let data = await Newsletter.find().sort({ _id: -1 })
        res.send({
            result: "Done",
            count: data.length,
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}


async function getSingleRecord(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (data)
            res.send({
                result: "Done",
                data: data
            })
        else
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (data) {
            data.active = req.body.active ?? data.active
            await data.save()

            res.send({
                result: "Done",
                data: data
            })
        }
        else
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
    } catch (error) {
        // console.log(error)

        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
            res.send({
                result: "Done",
                data: data
            })
        }
        else
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord
}