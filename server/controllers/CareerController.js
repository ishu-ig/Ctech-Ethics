const Career = require("../models/Career");

// Create Career
async function createRecord(req, res) {
    try {
        const data = new Career(req.body);

        await data.save();

        return res.status(201).json({
            result: "Done",
            data,
        });

    } catch (error) {
        console.error("Career createRecord error:", error);

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

// Get All Careers
async function getRecord(req, res) {
    try {

        const data = await Career.find()
            .sort({ featured: -1, createdAt: -1 });

        return res.status(200).json({
            result: "Done",
            count: data.length,
            data,
        });

    } catch (error) {

        return res.status(500).json({
            result: "Fail",
            reason: "Internal Server Error",
        });

    }
}

// Get Single Career
async function getSingleRecord(req, res) {
    try {

        const data = await Career.findById(req.params._id);

        if (!data) {
            return res.status(404).json({
                result: "Fail",
                reason: "Career Not Found",
            });
        }

        return res.status(200).json({
            result: "Done",
            data,
        });

    } catch (error) {

        return res.status(500).json({
            result: "Fail",
            reason: "Internal Server Error",
        });

    }
}

// Update Career
async function updateRecord(req, res) {
    try {

        const data = await Career.findById(req.params._id);

        if (!data) {
            return res.status(404).json({
                result: "Fail",
                reason: "Career Not Found",
            });
        }

        data.title = req.body.title !== undefined ? req.body.title : data.title;
        data.department = req.body.department !== undefined ? req.body.department : data.department;
        data.type = req.body.type !== undefined ? req.body.type : data.type;
        data.experience = req.body.experience !== undefined ? req.body.experience : data.experience;
        data.shortDescription = req.body.shortDescription !== undefined ? req.body.shortDescription : data.shortDescription;
        data.description = req.body.description !== undefined ? req.body.description : data.description;

        if (req.body.location) {
            data.location = {
                lat: req.body.location.lat ?? data.location?.lat ?? null,
                lng: req.body.location.lng ?? data.location?.lng ?? null,
                address: req.body.location.address ?? data.location?.address ?? "",
                city: req.body.location.city ?? data.location?.city,
                state: req.body.location.state ?? data.location?.state,
                pin: req.body.location.pin ?? data.location?.pin ?? "",
            };
        }

        data.salary = req.body.salary !== undefined ? req.body.salary : data.salary;
        data.responsibilities = req.body.responsibilities !== undefined ? req.body.responsibilities : data.responsibilities;
        data.eligibility = req.body.eligibility !== undefined ? req.body.eligibility : data.eligibility;
        data.skills = req.body.skills !== undefined ? req.body.skills : data.skills;
        data.benefits = req.body.benefits !== undefined ? req.body.benefits : data.benefits;
        data.deadline = req.body.deadline !== undefined ? req.body.deadline : data.deadline;
        data.vacancies = req.body.vacancies !== undefined ? req.body.vacancies : data.vacancies;
        data.featured = req.body.featured !== undefined ? req.body.featured : data.featured;
        data.status = req.body.status !== undefined ? req.body.status : data.status;

        await data.save();

        return res.status(200).json({
            result: "Done",
            data,
        });

    } catch (error) {
        console.error("Career updateRecord error:", error);

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

// Delete Career
async function deleteRecord(req, res) {
    try {

        const data = await Career.findById(req.params._id);

        if (!data) {
            return res.status(404).json({
                result: "Fail",
                reason: "Career Not Found",
            });
        }

        await data.deleteOne();

        return res.status(200).json({
            result: "Done",
            data,
        });

    } catch (error) {

        return res.status(500).json({
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