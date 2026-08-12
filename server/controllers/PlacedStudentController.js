const { deleteFromCloudinary } = require("../cloudinaryMethods");
const PlacedStudent = require("../models/PlacedStudent");

function toBool(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    return value === true || value === "true" || value === 1 || value === "1";
}

// Create
async function createRecord(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ result: "Fail", reason: { photo: "Student photo is mandatory" } });
        }

        const payload = {
            name: req.body.name,
            role: req.body.role,
            company: req.body.company,
            companyIcon: req.body.companyIcon || "bi-building",
            type: req.body.type || "Technical",
            package: req.body.package,
            photo: req.file.path.replace(/\\/g, "/"),
            status: toBool(req.body.status, true),
        };

        const data = new PlacedStudent(payload);
        await data.save();

        res.status(201).json({ result: "Done", data });
    } catch (error) {
        if (req.file) await deleteFromCloudinary(req.file.path);

        const errorMessage = {};
        if (error.errors) {
            Object.keys(error.errors).forEach((key) => { errorMessage[key] = error.errors[key].message; });
        }
        res.status(Object.keys(errorMessage).length ? 400 : 500).json({
            result: "Fail", reason: Object.keys(errorMessage).length ? errorMessage : "Internal Server Error",
        });
    }
}

// Get All
async function getRecord(req, res) {
    try {
        const data = await PlacedStudent.find().sort({ createdAt: -1 });
        res.json({ result: "Done", count: data.length, data });
    } catch (error) {
        res.status(500).json({ result: "Fail", reason: "Internal Server Error" });
    }
}

// Get Single
async function getSingleRecord(req, res) {
    try {
        const data = await PlacedStudent.findById(req.params._id);
        if (!data) return res.status(404).json({ result: "Fail", reason: "Record Not Found" });
        res.json({ result: "Done", data });
    } catch (error) {
        res.status(500).json({ result: "Fail", reason: "Internal Server Error" });
    }
}

// Update
async function updateRecord(req, res) {
    try {
        const data = await PlacedStudent.findById(req.params._id);
        if (!data) return res.status(404).json({ result: "Fail", reason: "Record Not Found" });

        if (req.body.name !== undefined) data.name = req.body.name;
        if (req.body.role !== undefined) data.role = req.body.role;
        if (req.body.company !== undefined) data.company = req.body.company;
        if (req.body.companyIcon !== undefined) data.companyIcon = req.body.companyIcon;
        if (req.body.type !== undefined) data.type = req.body.type;
        if (req.body.package !== undefined) data.package = req.body.package;
        if (req.body.status !== undefined) data.status = toBool(req.body.status, data.status);

        if (req.file) {
            if (data.photo) await deleteFromCloudinary(data.photo);
            data.photo = req.file.path.replace(/\\/g, "/");
        }

        await data.save();
        res.json({ result: "Done", data });
    } catch (error) {
        if (req.file) await deleteFromCloudinary(req.file.path);

        const errorMessage = {};
        if (error.errors) {
            Object.keys(error.errors).forEach((key) => { errorMessage[key] = error.errors[key].message; });
        }
        res.status(Object.keys(errorMessage).length ? 400 : 500).json({
            result: "Fail", reason: Object.keys(errorMessage).length ? errorMessage : "Internal Server Error",
        });
    }
}

// Delete
async function deleteRecord(req, res) {
    try {
        const data = await PlacedStudent.findById(req.params._id);
        if (!data) return res.status(404).json({ result: "Fail", reason: "Record Not Found" });

        if (data.photo) await deleteFromCloudinary(data.photo);
        await data.deleteOne();

        res.json({ result: "Done", data });
    } catch (error) {
        res.status(500).json({ result: "Fail", reason: "Internal Server Error" });
    }
}

module.exports = { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord };