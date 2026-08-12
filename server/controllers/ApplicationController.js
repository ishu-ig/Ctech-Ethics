const { deleteFromCloudinary } = require("../cloudinaryMethods"); // Adjust if using local storage
const Application = require("../models/Application");

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
            jobId: req.body.jobId || "General",
            jobTitle: req.body.jobTitle || "General Application"
        };

        const data = new Application(payload);
        await data.save();

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
        const data = await Application.find().sort({ createdAt: -1 });
        res.status(200).json({ result: "Done", count: data.length, data });
    } catch (error) {
        res.status(500).json({ result: "Fail", reason: "Internal Server Error" });
    }
}

// Update Status (Admin checking application)
async function updateRecord(req, res) {
    try {
        const data = await Application.findById(req.params._id);
        if (!data) return res.status(404).json({ result: "Fail", reason: "Record Not Found" });

        data.status = req.body.status || data.status;
        await data.save();

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

module.exports = { createRecord, getRecord, updateRecord, deleteRecord };