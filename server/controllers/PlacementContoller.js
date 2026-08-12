const { deleteFromCloudinary } = require("../cloudinaryMethods");
const Placement = require("../models/Placement");

// Helper function to safely extract location and skills from form-data
const parseNestedFormData = (body) => {
    // Extract Location
    let location = body.location || {
        address: body["location[address]"] || "",
        city: body["location[city]"] || "",
        state: body["location[state]"] || "",
        pin: body["location[pin]"] || "",
        lat: body["location[lat]"] ? Number(body["location[lat]"]) : null,
        lng: body["location[lng]"] ? Number(body["location[lng]"]) : null,
    };

    // Extract Skills Array
    let skills = [];
    if (body.skills) {
        skills = body.skills;
    } else if (body["skills[]"]) {
        skills = Array.isArray(body["skills[]"]) ? body["skills[]"] : [body["skills[]"]];
    }

    return { location, skills };
};

// Create
async function createRecord(req, res) {
    try {
        const { location, skills } = parseNestedFormData(req.body);

        const data = new Placement({
            ...req.body,
            location,
            skills,
        });

        // The frontend sends the file using the key 'companyLogo'
        if (req.file) {
            data.companyLogo = req.file.path;
        }

        await data.save();

        res.status(201).json({
            result: "Done",
            data,
        });
    } catch (error) {
        console.error("createRecord error:", error);

        if (req.file) {
            await deleteFromCloudinary(req.file.path);
        }

        const errorMessage = {};

        if (error.code === 11000) {
            errorMessage.jobTitle = "This placement already exists for this company.";
        }

        if (error.errors) {
            Object.keys(error.errors).forEach((key) => {
                errorMessage[key] = error.errors[key].message;
            });
        }

        res.status(Object.keys(errorMessage).length ? 400 : 500).json({
            result: "Fail",
            reason: Object.keys(errorMessage).length ? errorMessage : "Internal Server Error",
        });
    }
}

// Get All
async function getRecord(req, res) {
    try {
        // Since order is removed, we sort by newest first
        const data = await Placement.find().sort({ createdAt: -1 });

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

// Get Single
async function getSingleRecord(req, res) {
    try {
        const data = await Placement.findById(req.params._id);

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

// Update
async function updateRecord(req, res) {
    try {
        const data = await Placement.findById(req.params._id);

        if (!data) {
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found",
            });
        }

        // Handle Image Deletion and Update
        if (req.file) {
            if (data.companyLogo) {
                await deleteFromCloudinary(data.companyLogo);
            }
            data.companyLogo = req.file.path;
        }

        const { location, skills } = parseNestedFormData(req.body);

        // Update primitive fields
        data.companyName = req.body.companyName !== undefined ? req.body.companyName : data.companyName;
        data.jobTitle = req.body.jobTitle !== undefined ? req.body.jobTitle : data.jobTitle;
        data.category = req.body.category !== undefined ? req.body.category : data.category;
        data.type = req.body.type !== undefined ? req.body.type : data.type;
        data.experience = req.body.experience !== undefined ? req.body.experience : data.experience;
        data.shortDescription = req.body.shortDescription !== undefined ? req.body.shortDescription : data.shortDescription;
        data.description = req.body.description !== undefined ? req.body.description : data.description;
        data.responsibilities = req.body.responsibilities !== undefined ? req.body.responsibilities : data.responsibilities;
        data.eligibility = req.body.eligibility !== undefined ? req.body.eligibility : data.eligibility;
        data.benefits = req.body.benefits !== undefined ? req.body.benefits : data.benefits;
        data.salary = req.body.salary !== undefined ? req.body.salary : data.salary;
        data.companyInfo = req.body.companyInfo !== undefined ? req.body.companyInfo : data.companyInfo;
        data.applyLink = req.body.applyLink !== undefined ? req.body.applyLink : data.applyLink;
        data.deadline = req.body.deadline !== undefined ? req.body.deadline : data.deadline;
        data.vacancies = req.body.vacancies !== undefined ? req.body.vacancies : data.vacancies;
        data.featured = req.body.featured !== undefined ? req.body.featured : data.featured;
        data.status = req.body.status !== undefined ? req.body.status : data.status;

        // Update Objects/Arrays
        data.location = location;
        data.skills = skills;

        await data.save();

        res.status(200).json({
            result: "Done",
            data,
        });
    } catch (error) {
        console.error("updateRecord error:", error);

        if (req.file) {
            await deleteFromCloudinary(req.file.path);
        }

        const errorMessage = {};

        if (error.code === 11000) {
            errorMessage.jobTitle = "This placement already exists for this company.";
        }

        if (error.errors) {
            Object.keys(error.errors).forEach((key) => {
                errorMessage[key] = error.errors[key].message;
            });
        }

        res.status(Object.keys(errorMessage).length ? 400 : 500).json({
            result: "Fail",
            reason: Object.keys(errorMessage).length ? errorMessage : "Internal Server Error",
        });
    }
}

// Delete
async function deleteRecord(req, res) {
    try {
        const data = await Placement.findById(req.params._id);

        if (!data) {
            return res.status(404).json({
                result: "Fail",
                reason: "Record Not Found",
            });
        }

        if (data.companyLogo) {
            await deleteFromCloudinary(data.companyLogo);
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