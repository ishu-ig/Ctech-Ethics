const { deleteFromCloudinary } = require("../cloudinaryMethods");
const Testimonial = require("../models/Testimonial");

// Create
async function createRecord(req, res) {
    try {
        const data = new Testimonial(req.body);

        if (req.file) {
            data.pic = req.file.path;
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

        const data = await Testimonial.find().sort({ _id: -1 });

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

        const data = await Testimonial.findById(req.params._id);

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

        const data = await Testimonial.findById(req.params._id);

        if (!data)
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found",
            });

        if (req.file) {
            if (data.pic) {
                await deleteFromCloudinary(data.pic);
            }

            data.pic = req.file.path;
        }

        data.name = req.body.name;
        data.designation = req.body.designation;
        data.company = req.body.company;
        data.message = req.body.message;
        data.rating = req.body.rating;
        data.active = req.body.active;

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

        const data = await Testimonial.findById(req.params._id);

        if (!data)
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found",
            });

        if (data.pic) {
            await deleteFromCloudinary(data.pic);
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