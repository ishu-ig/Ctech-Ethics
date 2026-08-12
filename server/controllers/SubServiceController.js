const SubService = require("../models/SubService");

// Create — creates a new sub-service under a parent service. serviceId's
// required: true is enforced by the schema, so a missing/invalid parent
// falls through to the ValidationError branch below.
async function createRecord(req, res) {
    try {

        const data = new SubService(req.body);
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

// Get — public-facing fetch of active sub-services. Pass ?serviceId=... to
// scope to one parent service's page; omit it to get every active
// sub-service across all services.
async function getRecord(req, res) {
    try {

        const filter = { status: true };
        if (req.query.serviceId) filter.serviceId = req.query.serviceId;

        const data = await SubService.find(filter)
            .populate("serviceId", "title slug")
            .sort({ createdAt: -1 });

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


// Get Single — admin fetch by _id (ignores status so drafts are editable)
async function getSingleRecord(req, res) {
    try {

        const data = await SubService.findById(req.params._id).populate("serviceId", "title slug");

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

// Update — replaces serviceId, name, icon, description, tags, and status
// wholesale from req.body. tags is sent as a full array each time, same
// convention as AboutPage's content arrays (no partial diff/merge).
async function updateRecord(req, res) {
    try {

        const data = await SubService.findById(req.params._id);

        if (!data)
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found"
            });

        data.serviceId = req.body.serviceId;
        data.name = req.body.name;
        data.icon = req.body.icon;
        data.description = req.body.description;
        data.tags = req.body.tags;
        data.status = req.body.status;

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

// Delete — removes the sub-service document entirely.
async function deleteRecord(req, res) {
    try {

        const data = await SubService.findById(req.params._id);

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