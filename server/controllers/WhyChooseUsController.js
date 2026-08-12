const WhyChooseUs = require("../models/WhyChooseUs");

// Create Record
async function createRecord(req, res) {
    try {
        const data = new WhyChooseUs(req.body);
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

        return res.status(Object.keys(errorMessage).length ? 400 : 500).json({
            result: "Fail",
            reason: Object.keys(errorMessage).length
                ? errorMessage
                : "Internal Server Error",
        });
    }
}

// Get All Records
async function getRecord(req, res) {
    try {
        const data = await WhyChooseUs.find().sort({ order: 1, _id: -1 });

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

// Get Single Record
async function getSingleRecord(req, res) {
    try {
        const data = await WhyChooseUs.findById(req.params._id);

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

// Update Record
async function updateRecord(req, res) {
    try {
        const data = await WhyChooseUs.findById(req.params._id);

        if (!data) {
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found",
            });
        }

        data.icon = req.body.icon;
        data.badge = req.body.badge;
        data.title = req.body.title;
        data.description = req.body.description;
        data.status = req.body.status;

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
            reason: Object.keys(errorMessage).length
                ? errorMessage
                : "Internal Server Error",
        });
    }
}

// Delete Record
async function deleteRecord(req, res) {
    try {
        const data = await WhyChooseUs.findById(req.params._id);

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