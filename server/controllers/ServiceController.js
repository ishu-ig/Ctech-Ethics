const { deleteFromCloudinary } = require("../cloudinaryMethods");
const Service = require("../models/Service");

function parseJSONField(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    if (typeof value === "object") return value;
    try { return JSON.parse(value); } catch { return fallback; }
}

function toBool(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    return value === true || value === "true" || value === 1 || value === "1";
}

// Create
async function createRecord(req, res) {
    try {
        const payload = {
            title: req.body.title,
            slug: req.body.slug,
            icon: req.body.icon,
            gradient: req.body.gradient,
            description: req.body.description,
            tagline: req.body.tagline,
            overview: parseJSONField(req.body.overview, { heading: "", paragraphs: [], stats: [] }),
            features: parseJSONField(req.body.features, []),
            status: toBool(req.body.status, true),
        };

        const data = new Service(payload);

        // --- Handle Image: File Upload OR URL String ---
        if (req.file) {
            data.image = req.file.path.replace(/\\/g, "/");
        } else if (req.body.image) {
            data.image = req.body.image;
        } else {
            return res.status(400).json({ result: "Fail", reason: { image: "Card image (File or URL) is mandatory" } });
        }

        await data.save();
        res.status(201).json({ result: "Done", data });
    } catch (error) {
        if (req.file) await deleteFromCloudinary(req.file.path);

        const errorMessage = {};
        if (error.code === 11000) errorMessage.slug = "This URL slug is already taken.";
        if (error.errors) Object.keys(error.errors).forEach(key => errorMessage[key] = error.errors[key].message);

        res.status(Object.keys(errorMessage).length ? 400 : 500).json({
            result: "Fail", reason: Object.keys(errorMessage).length ? errorMessage : "Internal Server Error",
        });
    }
}

// Get All (Public)
async function getRecord(req, res) {
    try {
        const data = await Service.find({ status: true }).sort({ createdAt: -1 });
        res.json({ result: "Done", data });
    } catch (error) {
        res.status(500).json({ result: "Fail", reason: "Internal Server Error" });
    }
}

// Get Single
async function getSingleRecord(req, res) {
    try {
        const data = await Service.findById(req.params._id);
        if (!data) return res.status(404).json({ result: "Fail", reason: "Record Not Found" });
        res.json({ result: "Done", data });
    } catch (error) {
        res.status(500).json({ result: "Fail", reason: "Internal Server Error" });
    }
}

// Update
async function updateRecord(req, res) {
    try {
        const data = await Service.findById(req.params._id);
        if (!data) return res.status(404).json({ result: "Fail", reason: "Record Not Found" });

        // --- Handle Image Update: File Upload OR URL String ---
        if (req.file) {
            // Delete old file if it existed
            if (data.image) await deleteFromCloudinary(data.image);
            data.image = req.file.path.replace(/\\/g, "/");
        } else if (req.body.image !== undefined && req.body.image !== "") {
            // If user provides a new URL, replace the old one
            if (data.image !== req.body.image) {
                if (data.image) await deleteFromCloudinary(data.image);
                data.image = req.body.image;
            }
        }

        // Update primitives & objects
        if (req.body.title !== undefined) data.title = req.body.title;
        if (req.body.slug !== undefined) data.slug = req.body.slug;
        if (req.body.icon !== undefined) data.icon = req.body.icon;
        if (req.body.gradient !== undefined) data.gradient = req.body.gradient;
        if (req.body.description !== undefined) data.description = req.body.description;
        if (req.body.tagline !== undefined) data.tagline = req.body.tagline;
        if (req.body.status !== undefined) data.status = toBool(req.body.status, data.status);
        if (req.body.overview !== undefined) data.overview = parseJSONField(req.body.overview, data.overview);
        if (req.body.features !== undefined) data.features = parseJSONField(req.body.features, data.features);

        await data.save();
        res.json({ result: "Done", data });

    } catch (error) {
        if (req.file) await deleteFromCloudinary(req.file.path);

        const errorMessage = {};
        if (error.code === 11000) errorMessage.slug = "This URL slug is already taken.";
        if (error.errors) Object.keys(error.errors).forEach(key => errorMessage[key] = error.errors[key].message);

        res.status(Object.keys(errorMessage).length ? 400 : 500).json({
            result: "Fail", reason: Object.keys(errorMessage).length ? errorMessage : "Internal Server Error",
        });
    }
}

// Delete
async function deleteRecord(req, res) {
    try {
        const data = await Service.findById(req.params._id);
        if (!data) return res.status(404).json({ result: "Fail", reason: "Record Not Found" });

        await data.deleteOne();
        if (data.image) await deleteFromCloudinary(data.image);

        res.json({ result: "Done", data });
    } catch (error) {
        res.status(500).json({ result: "Fail", reason: "Internal Server Error" });
    }
}

module.exports = { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord };