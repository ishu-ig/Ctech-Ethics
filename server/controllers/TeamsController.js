const { deleteFromCloudinary } = require("../cloudinaryMethods");
const Team = require("../models/Teams");

// Create
async function createRecord(req, res) {
    try {
        // 1. Parse stringified JSON from FormData before saving
        if (req.body.skills && typeof req.body.skills === "string") {
            try { req.body.skills = JSON.parse(req.body.skills); } catch (e) { }
        }
        if (req.body.social && typeof req.body.social === "string") {
            try { req.body.social = JSON.parse(req.body.social); } catch (e) { }
        }

        const data = new Team(req.body);

        if (req.file) {
            data.image = req.file.path;
        }

        await data.save();

        res.status(201).json({
            result: "Done",
            data,
        });
    } catch (error) {

        if (req.file) {
            await deleteFromCloudinary(req.file.path);
        }

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

// Get All
async function getRecord(req, res) {
    try {
        // 2. Fixed sorting: "order" no longer exists, sort by newest first instead
        const data = await Team.find({ status: true }).sort({ createdAt: -1 });

        res.json({
            result: "Done",
            count: data.length,
            data,
        });
    } catch (error) {
        res.status(500).json({
            result: "Fail",
            reason: "Internal Server Error",
        });
    }
}

// Get Single
async function getSingleRecord(req, res) {
    try {
        const data = await Team.findById(req.params._id);

        if (!data)
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found",
            });

        res.json({
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

// Update
async function updateRecord(req, res) {
    try {
        const data = await Team.findById(req.params._id);

        if (!data)
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found",
            });

        if (req.file) {
            if (data.image)
                await deleteFromCloudinary(data.image);

            data.image = req.file.path;
        }

        // 3. Parse stringified JSON from FormData before updating
        let parsedSkills = req.body.skills;
        let parsedSocial = req.body.social;

        if (parsedSkills && typeof parsedSkills === "string") {
            try { parsedSkills = JSON.parse(parsedSkills); } catch (e) { }
        }
        if (parsedSocial && typeof parsedSocial === "string") {
            try { parsedSocial = JSON.parse(parsedSocial); } catch (e) { }
        }

        data.name = req.body.name || data.name;
        data.role = req.body.role || data.role;
        data.badge = req.body.badge || data.badge;
        data.bio = req.body.bio || data.bio;
        if (parsedSkills) data.skills = parsedSkills;
        if (parsedSocial) data.social = parsedSocial;
        if (req.body.status !== undefined) data.status = req.body.status;

        await data.save();

        res.json({
            result: "Done",
            data,
        });

    } catch (error) {

        if (req.file) {
            await deleteFromCloudinary(req.file.path);
        }

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

// Delete
async function deleteRecord(req, res) {
    try {
        const data = await Team.findById(req.params._id);

        if (!data)
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found",
            });

        if (data.image) {
            await deleteFromCloudinary(data.image);
        }

        await data.deleteOne();

        res.json({
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

module.exports = {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
};