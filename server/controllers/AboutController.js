const About = require("../models/About");

// Multipart/form-data (used because the routes accept an optional image
// upload) sends nested objects/arrays as JSON strings. JSON.parse them
// back into real objects before handing them to Mongoose. If a field is
// already an object (e.g. requests sent as plain JSON), leave it as-is.
function parseField(value) {
    if (typeof value !== "string") return value;
    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
}

// Create — creates the singleton About page document.
// Only one "live" document is expected, so this refuses to create
// a second one if one already exists (use updateRecord instead).
async function createRecord(req, res) {
    try {
        const existing = await About.findOne();

        if (existing)
            return res.status(400).json({
                result: "Fail",
                reason: "About page already exists. Use update instead.",
            });

        const data = new About({
            companyInfo: parseField(req.body.companyInfo),
            storyline: parseField(req.body.storyline),
            aboutFeatures: parseField(req.body.aboutFeatures),
            aboutSlides: parseField(req.body.aboutSlides),
            coreValues: parseField(req.body.coreValues),
            timeline: parseField(req.body.timeline),
            isPublished: req.body.isPublished,
        });
        await data.save();

        res.status(201).json({
            result: "Done",
            data,
        });
    } catch (error) {

        const errorMessage = {};

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            errorMessage[field] = `${field} already exists`;
        }

        if (error.errors) {
            Object.keys(error.errors).forEach((key) => {
                errorMessage[key] = error.errors[key].message;
            });
        }

        res.status(Object.keys(errorMessage).length ? 400 : 500).json({
            result: "Fail",
            reason: Object.keys(errorMessage).length
                ? errorMessage
                : "Internal Server Error",
        });
    }
}

// Get — public-facing fetch of the published singleton
async function getRecord(req, res) {
    try {

        const data = await About.getSingleton();

        if (!data)
            return res.status(404).json({
                result: "Fail",
                reason: "About page not found",
            });

        res.json({
            result: "Done",
            data,
        });

    } catch (error) {
        res.status(500).json({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}

// Get Single — admin fetch by _id (ignores isPublished so drafts are editable)
async function getSingleRecord(req, res) {
    try {

        const data = await About.findById(req.params._id);

        if (!data)
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found"
            });

        res.json({
            result: "Done",
            data
        });

    } catch (error) {

        res.status(500).json({
            result: "Fail",
            reason: "Internal Server Error"
        });

    }
}

// Update — replaces companyInfo, isPublished, and the four content arrays
// wholesale. Send the full array (aboutFeatures, aboutSlides, coreValues,
// timeline) each time, not a partial diff, since sub-docs have no _id
// to merge against individually.
async function updateRecord(req, res) {
    try {

        const data = await About.findById(req.params._id);

        if (!data)
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found"
            });

        data.companyInfo = parseField(req.body.companyInfo);
        data.storyline = parseField(req.body.storyline);
        data.aboutFeatures = parseField(req.body.aboutFeatures);
        data.aboutSlides = parseField(req.body.aboutSlides);
        data.coreValues = parseField(req.body.coreValues);
        data.timeline = parseField(req.body.timeline);
        data.isPublished = req.body.isPublished;

        await data.save();

        res.json({
            result: "Done",
            data
        });

    } catch (error) {

        const errorMessage = {};

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            errorMessage[field] = `${field} already exists`;
        }

        if (error.errors) {
            Object.keys(error.errors).forEach((key) => {
                errorMessage[key] = error.errors[key].message;
            });
        }

        res.status(Object.keys(errorMessage).length ? 400 : 500).json({
            result: "Fail",
            reason: Object.keys(errorMessage).length
                ? errorMessage
                : "Internal Server Error",
        });
    }
}

// Delete — removes the singleton document entirely.
// Kept for parity with the standard CRUD shape; most admins will
// prefer flipping isPublished to false via updateRecord instead.
async function deleteRecord(req, res) {
    try {

        const data = await About.findById(req.params._id);

        if (!data)
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found"
            });

        await data.deleteOne();

        res.json({
            result: "Done",
            data
        });

    } catch (error) {

        res.status(500).json({
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