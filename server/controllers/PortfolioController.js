const { deleteFromCloudinary } = require("../cloudinaryMethods");
const Portfolio = require("../models/Portfolio");

// Create Portfolio Project
async function createRecord(req, res) {
    try {
        // Parse the tech array if it is sent as a JSON string via FormData
        if (req.body.tech && typeof req.body.tech === "string") {
            try {
                req.body.tech = JSON.parse(req.body.tech);
            } catch (e) {
                console.error("Error parsing tech array", e);
            }
        }

        const data = new Portfolio(req.body);

        // CHANGED: Handle multiple file uploads (req.files)
        data.images = [];
        if (req.files && req.files.length > 0) {
            data.images = req.files.map((file) => file.path);
        } else if (req.body.images) {
            // Fallback if frontend sent an array of URLs instead of actual files
            try {
                data.images = JSON.parse(req.body.images);
            } catch (e) {
                data.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
            }
        }

        await data.save();

        return res.status(201).json({
            result: "Done",
            data,
        });
    } catch (error) {
        // Cleanup newly uploaded files if DB save fails
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                await deleteFromCloudinary(file.path);
            }
        }

        const errorMessage = {};

        if (error.code === 11000) {
            errorMessage.title = "A project with this title already exists.";
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

// Get All Portfolio Projects
async function getRecord(req, res) {
    try {
        const data = await Portfolio.find().sort({ _id: -1 });

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

// Get Single Portfolio Project
async function getSingleRecord(req, res) {
    try {
        const data = await Portfolio.findById(req.params._id);

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

// Update Portfolio Project
async function updateRecord(req, res) {
    try {
        const data = await Portfolio.findById(req.params._id);

        if (!data) {
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found",
            });
        }

        // --- HANDLE IMAGES UPDATE ---
        let finalImages = [];

        // 1. Check for existing images sent back from frontend (URLs they want to KEEP)
        if (req.body.images) {
            if (typeof req.body.images === "string") {
                try { finalImages = JSON.parse(req.body.images); }
                catch (e) { finalImages = [req.body.images]; }
            } else if (Array.isArray(req.body.images)) {
                finalImages = req.body.images;
            }
        }

        // 2. Identify images that were removed by the user, and delete them from Cloudinary
        const imagesToDelete = data.images.filter(img => !finalImages.includes(img));
        for (const img of imagesToDelete) {
            await deleteFromCloudinary(img);
        }

        // 3. Append newly uploaded files
        if (req.files && req.files.length > 0) {
            const newPaths = req.files.map((file) => file.path);
            finalImages = [...finalImages, ...newPaths];
        }

        data.images = finalImages;
        // ----------------------------

        // Parse tech array
        let parsedTech = req.body.tech;
        if (parsedTech && typeof parsedTech === "string") {
            try {
                parsedTech = JSON.parse(parsedTech);
            } catch (e) {
                console.error("Error parsing tech array", e);
            }
        }

        // Update primitive fields
        data.title = req.body.title !== undefined ? req.body.title : data.title;
        data.category = req.body.category !== undefined ? req.body.category : data.category;
        data.desc = req.body.desc !== undefined ? req.body.desc : data.desc;
        data.link = req.body.link !== undefined ? req.body.link : data.link;
        data.status = req.body.status !== undefined ? req.body.status : data.status;

        if (parsedTech) {
            data.tech = parsedTech;
        }

        await data.save();

        res.status(200).json({
            result: "Done",
            data,
        });
    } catch (error) {
        // Cleanup newly uploaded files if DB save fails
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                await deleteFromCloudinary(file.path);
            }
        }

        const errorMessage = {};

        if (error.code === 11000) {
            errorMessage.title = "A project with this title already exists.";
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

// Delete Portfolio Project
async function deleteRecord(req, res) {
    try {
        const data = await Portfolio.findById(req.params._id);

        if (!data) {
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found",
            });
        }

        // CHANGED: Loop through the array to delete all images from Cloudinary
        if (data.images && data.images.length > 0) {
            for (const img of data.images) {
                await deleteFromCloudinary(img);
            }
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