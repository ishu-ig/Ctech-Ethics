const { deleteFromCloudinary } = require("../cloudinaryMethods"); // Adjust if using local storage
const mailer = require("../mailer/index");
const Application = require("../models/Application");
const {
    jobApplicationCandidateTemplate,
    jobApplicationStatusUpdateTemplate
} = require("../mailer/templates");

const JOB_POPULATE_FIELDS = "title department type experience location salary status"; // adjust as needed

// Create (Frontend Apply Form)
async function createRecord(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ result: "Fail", reason: { resume: "Resume file is mandatory" } });
        }

        const payload = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message,
            resume: req.file.path.replace(/\\/g, "/"), // Cloudinary or local path
            jobId: req.body.jobId || null, // Career ObjectId, or null for general applications
            jobTitle: req.body.jobTitle || "General Application"
        };

        const data = new Application(payload);
        await data.save();

        // Send application confirmation email to candidate
        try {
            await mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: `Application Received - ${data.jobTitle} | ${process.env.SITE_NAME || "CTech Ethics"}`,
                html: jobApplicationCandidateTemplate({
                    name: data.name,
                    jobTitle: data.jobTitle
                })
            });
            console.log(`Job application confirmation email sent to ${data.email}`);
        } catch (mailErr) {
            console.error("Application saved, but confirmation email failed:", mailErr);
        }

        res.status(201).json({ result: "Done", data });
    } catch (error) {
        // Cleanup uploaded file if DB save fails
        if (req.file) await deleteFromCloudinary(req.file.path);

        const errorMessage = {};
        if (error.errors) {
            Object.keys(error.errors).forEach(key => { errorMessage[key] = error.errors[key].message; });
        }
        res.status(400).json({ result: "Fail", reason: Object.keys(errorMessage).length ? errorMessage : "Internal Server Error" });
    }
}

// Get All (For Admin Dashboard)
async function getRecord(req, res) {
    try {
        const data = await Application.find()
            .populate("jobId", JOB_POPULATE_FIELDS)
            .sort({ createdAt: -1 });

        res.status(200).json({ result: "Done", count: data.length, data });
    } catch (error) {
        res.status(500).json({ result: "Fail", reason: "Internal Server Error" });
    }
}

async function getSingleRecord(req, res) {
    try {
        const data = await Application.findById(req.params._id).populate("jobId", JOB_POPULATE_FIELDS);

        if (!data) {
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found",
            });
        }

        res.status(200).json({
            result: "Done",
            data,
        });
    } catch (error) {
        res.status(500).json({
            result: "Fail",
            reason: "Internal Server Error",
        });
    }
}

// ✅ UPDATED: Update Status & Send Mail
async function updateRecord(req, res) {
    try {
        const data = await Application.findById(req.params._id).populate("jobId", JOB_POPULATE_FIELDS);
        if (!data) return res.status(404).json({ result: "Fail", reason: "Record Not Found" });

        const oldStatus = data.status;
        const newStatus = req.body.status || data.status;

        // Update and save in DB
        data.status = newStatus;
        await data.save();

        // If the status actually changed, send an email notification
        if (oldStatus !== newStatus) {
            const subject = `Update on your application for ${data.jobTitle}`;

            try {
                await mailer.sendMail({
                    from: process.env.MAIL_SENDER,
                    to: data.email,
                    subject: subject,
                    html: jobApplicationStatusUpdateTemplate({
                        name: data.name,
                        jobTitle: data.jobTitle,
                        status: newStatus
                    })
                });
                console.log(`Notification email sent to ${data.email} for status: ${newStatus}`);
            } catch (mailError) {
                console.error("Database updated, but failed to send status update email:", mailError);
            }
        }

        res.status(200).json({ result: "Done", data });
    } catch (error) {
        res.status(400).json({ result: "Fail", reason: "Internal Server Error" });
    }
}

// Delete
async function deleteRecord(req, res) {
    try {
        const data = await Application.findById(req.params._id);
        if (!data) return res.status(404).json({ result: "Fail", reason: "Record Not Found" });

        if (data.resume) await deleteFromCloudinary(data.resume);
        await data.deleteOne();

        res.status(200).json({ result: "Done", data });
    } catch (error) {
        res.status(500).json({ result: "Fail", reason: "Internal Server Error" });
    }
}

module.exports = { createRecord, getRecord, updateRecord, getSingleRecord, deleteRecord };