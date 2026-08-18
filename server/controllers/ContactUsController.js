const ContactUs = require("../models/ContactUs");
const mailer = require("../mailer/index");
const {
    contactUserTemplate,
    contactAdminAlertTemplate,
    contactResolvedTemplate
} = require("../mailer/templates");

async function createRecord(req, res) {
    try {
        let data = new ContactUs(req.body);
        await data.save();

        // 1. Send confirmation email to user
        try {
            await mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: `Your Query Submission - ${process.env.SITE_NAME || "Ctech Ethics Solutions"}`,
                html: contactUserTemplate({
                    name: data.name,
                    subject: data.subject,
                    message: data.message
                })
            });
            console.log(`ContactUs user confirmation sent to ${data.email}`);
        } catch (mailErr) {
            console.error("ContactUs user confirmation email failed:", mailErr);
        }

        // 2. Send notification to site admin
        try {
            if (process.env.MAIL_SENDER && process.env.MAIL_SENDER !== data.email) {
                await mailer.sendMail({
                    from: process.env.MAIL_SENDER,
                    to: process.env.MAIL_SENDER,
                    subject: `[New Inquiry] ${data.name}: ${data.subject}`,
                    html: contactAdminAlertTemplate({
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        subject: data.subject,
                        message: data.message
                    })
                });
                console.log("ContactUs admin notification sent");
            }
        } catch (adminMailErr) {
            console.error("ContactUs admin notification failed:", adminMailErr);
        }

        res.send({
            result: "Done",
            data: data,
            message: "Thanks to Share Your Query With Us. Our Team Will Contact You Soon!!!"
        })
    } catch (error) {
        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.email ? errorMessage.email = error.errors.email.message : null
        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : null
        error.errors?.subject ? errorMessage.subject = error.errors.subject.message : null
        error.errors?.message ? errorMessage.message = error.errors.message.message : null

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
        let data = await ContactUs.find().sort({ _id: -1 })
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
        let data = await ContactUs.findOne({ _id: req.params._id })
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
        let data = await ContactUs.findOne({ _id: req.params._id })
        if (data) {
            data.active = req.body.active ?? data.active
            await data.save()
            if (data.active === false) {
                try {
                    await mailer.sendMail({
                        from: process.env.MAIL_SENDER,
                        to: data.email,
                        subject: `Query Resolved - ${process.env.SITE_NAME || "Ctech Ethics Solutions"}`,
                        html: contactResolvedTemplate({
                            name: data.name,
                            subject: data.subject
                        })
                    });
                    console.log(`Query resolved notification sent to ${data.email}`);
                } catch (mailError) {
                    console.error("Query resolved email send error:", mailError);
                }
            }

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
        let data = await ContactUs.findOne({ _id: req.params._id })
        if (data && data.active === false) {
            await data.deleteOne()
            res.send({
                result: "Done",
                data: data
            })
        }
        else if (data?.active) {
            res.status(400).send({
                result: "Fail",
                reason: "Unable to Delete Record. Query Has Not Been Resolved"
            })
        }
        else
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
    } catch (error) {
        console.log(error)
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