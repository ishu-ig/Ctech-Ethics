const { deleteFromCloudinary } = require("../cloudinaryMethods"); // Adjust if using local storage
const mailer = require("../mailer/index");
const Application = require("../models/Application");

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
                subject: `Application Received - ${data.jobTitle} | ${process.env.SITE_NAME}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; border: 1px solid #e0e0e0; border-radius: 8px;">
                        <h2 style="color: #0d6efd; margin-top: 0;">Application Received!</h2>
                        <p>Dear <strong>${data.name}</strong>,</p>
                        <p>Thank you for applying for the position of <strong>${data.jobTitle}</strong> at <strong>${process.env.SITE_NAME}</strong>.</p>
                        <p>We have successfully received your application and resume. Our hiring team will review your profile and contact you if your qualifications match our requirements.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 13px; color: #777;">If you have any questions, please reply to this email.</p>
                        <p style="font-size: 14px; margin-bottom: 0;">Best regards,<br/><strong>${process.env.SITE_NAME} Recruitment Team</strong></p>
                    </div>
                `
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
            const htmlMessage = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h3>Application Status Update</h3>
                    <p>Dear <strong>${data.name}</strong>,</p>
                    <p>There is an update regarding your application for the position of <strong>${data.jobTitle}</strong>.</p>
                    <p>Your current application status is now: <strong style="color: #0056b3;">${newStatus}</strong></p>
                    <p>If you have any questions, feel free to reach out to us.</p>
                    <br/>
                    <p>Best regards,</p>
                    <p><strong>CTech Ethic Solution Hiring Team</strong></p>
                </div>
            `;

            try {
                await mailer.sendMail({
                    from: process.env.MAIL_SENDER,
                    to: data.email,
                    subject: subject,
                    html: htmlMessage,
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