const { deleteFromCloudinary } = require("../cloudinaryMethods");
const Banner = require("../models/Banner");

// Create Banner
async function createRecord(req, res) {
    try {
        const data = new Banner(req.body);

        // If an image file was uploaded, use its path.
        // (If a URL string was sent instead, new Banner(req.body) already handles it).
        if (req.file) {
            data.image = req.file.path;
        }

        await data.save();

        return res.status(201).json({
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

        return res.status(Object.keys(errorMessage).length ? 400 : 500).json({
            result: "Fail",
            reason:
                Object.keys(errorMessage).length
                    ? errorMessage
                    : "Internal Server Error",
        });
    }
}

// Get All Banners
async function getRecord(req, res) {
    try {
        const data = await Banner.find().sort({ _id: -1 });

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

// Get Single Banner
async function getSingleRecord(req, res) {
    try {
        const data = await Banner.findById(req.params._id);

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

// Update Banner
async function updateRecord(req, res) {
    try {
        const data = await Banner.findById(req.params._id);

        if (!data) {
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found",
            });
        }

        // Handle Image Update (Upload vs URL)
        if (req.file) {
            // Delete the old image from Cloudinary if it exists
            if (data.image) {
                await deleteFromCloudinary(data.image);
            }
            data.image = req.file.path;
        } else if (req.body.image) {
            // If the user pasted a new URL string instead of uploading a file
            data.image = req.body.image;
        }

        // Update the new schema fields
        data.badge = req.body.badge !== undefined ? req.body.badge : data.badge;
        data.headline = req.body.headline !== undefined ? req.body.headline : data.headline;
        data.tagline = req.body.tagline !== undefined ? req.body.tagline : data.tagline;
        data.body = req.body.body !== undefined ? req.body.body : data.body;
        data.accent = req.body.accent !== undefined ? req.body.accent : data.accent;
        data.status = req.body.status !== undefined ? req.body.status : data.status;

        await data.save();

        res.status(200).json({
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

        return res.status(Object.keys(errorMessage).length ? 400 : 500).json({
            result: "Fail",
            reason:
                Object.keys(errorMessage).length
                    ? errorMessage
                    : "Internal Server Error",
        });
    }
}

// Delete Banner
async function deleteRecord(req, res) {
    try {
        const data = await Banner.findById(req.params._id);

        if (!data) {
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found",
            });
        }

        if (data.image) {
            await deleteFromCloudinary(data.image);
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