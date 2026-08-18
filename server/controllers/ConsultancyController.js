const Consultancy = require("../models/Consultancy");
const mailer = require("../mailer/index");
const {
    consultancyUserTemplate,
    consultancyAdminAlertTemplate,
    consultancyCompletedTemplate
} = require("../mailer/templates");

// Create new consultancy request (from client modal/form)
async function createRecord(req, res) {
    try {
        const data = new Consultancy(req.body);
        await data.save();

        // 1. Send confirmation email to user
        try {
            await mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: `Consultation Request Received - ${process.env.SITE_NAME || "CTech Ethic Solution"}`,
                html: consultancyUserTemplate({
                    name: data.name,
                    service: data.service,
                    budget: data.budget,
                    phone: data.phone,
                    description: data.description
                })
            });
            console.log(`Consultancy confirmation email sent to ${data.email}`);
        } catch (mailErr) {
            console.error("Consultancy saved, but confirmation email error:", mailErr);
        }

        // 2. Send notification to site admin
        try {
            if (process.env.MAIL_SENDER && process.env.MAIL_SENDER !== data.email) {
                await mailer.sendMail({
                    from: process.env.MAIL_SENDER,
                    to: process.env.MAIL_SENDER,
                    subject: `[Consultation Booking] ${data.name} - ${data.service}`,
                    html: consultancyAdminAlertTemplate({
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        service: data.service,
                        budget: data.budget,
                        description: data.description
                    })
                });
                console.log("Consultancy admin notification sent");
            }
        } catch (adminMailErr) {
            console.error("Consultancy admin notification failed:", adminMailErr);
        }

        res.status(201).send({
            result: "Done",
            data: data,
            message: "Thanks for booking a consultation with us. Our team will contact you soon!"
        });
    } catch (error) {
        let errorMessage = {};
        if (error.errors) {
            Object.keys(error.errors).forEach((key) => {
                errorMessage[key] = error.errors[key].message;
            });
        }

        if (Object.values(errorMessage).length === 0) {
            res.status(500).send({
                result: "Fail",
                reason: "Internal Server Error"
            });
        } else {
            res.status(400).send({
                result: "Fail",
                reason: errorMessage
            });
        }
    }
}

// Get all consultancy requests
async function getRecord(req, res) {
    try {
        let data = await Consultancy.find().sort({ _id: -1 });
        res.send({
            result: "Done",
            count: data.length,
            data: data
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}

// Get single consultancy request by ID
async function getSingleRecord(req, res) {
    try {
        let data = await Consultancy.findOne({ _id: req.params._id });
        if (data) {
            res.send({
                result: "Done",
                data: data
            });
        } else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            });
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}

// Update consultancy request status / active
async function updateRecord(req, res) {
    try {
        let data = await Consultancy.findOne({ _id: req.params._id });
        if (data) {
            const oldStatus = data.status;
            const oldActive = data.active;

            if (req.body.name !== undefined) data.name = req.body.name;
            if (req.body.email !== undefined) data.email = req.body.email;
            if (req.body.phone !== undefined) data.phone = req.body.phone;
            if (req.body.service !== undefined) data.service = req.body.service;
            if (req.body.budget !== undefined) data.budget = req.body.budget;
            if (req.body.description !== undefined) data.description = req.body.description;
            if (req.body.status !== undefined) data.status = req.body.status;
            if (req.body.active !== undefined) data.active = req.body.active;

            await data.save();

            // Notify user on status update or resolution if relevant
            if (oldStatus !== data.status && data.status === "Completed") {
                try {
                    await mailer.sendMail({
                        from: process.env.MAIL_SENDER,
                        to: data.email,
                        subject: `Consultation Process Completed - ${process.env.SITE_NAME || "CTech Ethic Solution"}`,
                        html: consultancyCompletedTemplate({
                            name: data.name,
                            service: data.service
                        })
                    });
                    console.log(`Consultation completed email sent to ${data.email}`);
                } catch (mailError) {
                    console.log("Status mail error:", mailError);
                }
            }

            res.send({
                result: "Done",
                data: data
            });
        } else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            });
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}

// Delete record
async function deleteRecord(req, res) {
    try {
        let data = await Consultancy.findOne({ _id: req.params._id });
        if (data) {
            await data.deleteOne();
            res.send({
                result: "Done",
                data: data
            });
        } else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}

module.exports = {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
};
