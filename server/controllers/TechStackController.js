const TechStack = require("../models/TechStack");

// Create Tech Stack
async function createRecord(req, res) {
    try {
        const data = new TechStack(req.body);
        await data.save();

        return res.status(201).json({
            result: "Done",
            data,
        });
    } catch (error) {
        const errorMessage = {};

        // Handle Duplicate Entry Error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            errorMessage[field] = `${field} already exists`;
        }

        // Handle Validation Errors
        if (error.errors) {
            Object.keys(error.errors).forEach((key) => {
                errorMessage[key] = error.errors[key].message;
            });
        }

        return res.status(Object.keys(errorMessage).length ? 400 : 500).json({
            result: "Fail",
            reason: Object.keys(errorMessage).length ? errorMessage : "Internal Server Error",
        });
    }
}

// Get All Tech Stacks
async function getRecord(req, res) {
    try {
        // Fetch and sort by newest first
        const data = await TechStack.find().sort({ _id: -1 });

        res.status(200).json({
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

// Get Single Tech Stack
async function getSingleRecord(req, res) {
    try {
        const data = await TechStack.findById(req.params._id);

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

// Update Tech Stack
async function updateRecord(req, res) {
    try {
        const data = await TechStack.findById(req.params._id);

        if (!data) {
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found",
            });
        }

        // Update fields
        data.name = req.body.name || data.name;
        data.icon = req.body.icon !== undefined ? req.body.icon : data.icon;
        data.color = req.body.color !== undefined ? req.body.color : data.color;
        data.status = req.body.status !== undefined ? req.body.status : data.status;

        await data.save();

        res.status(200).json({
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

        return res.status(Object.keys(errorMessage).length ? 400 : 500).json({
            result: "Fail",
            reason: Object.keys(errorMessage).length ? errorMessage : "Internal Server Error",
        });
    }
}

// Delete Tech Stack
async function deleteRecord(req, res) {
    try {
        const data = await TechStack.findById(req.params._id);

        if (!data) {
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found",
            });
        }

        await data.deleteOne();

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

module.exports = {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
};