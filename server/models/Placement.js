const mongoose = require("mongoose");

const PlacementSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: [true, "Company Name is mandatory"],
            trim: true,
        },
        jobTitle: {
            type: String,
            required: [true, "Job Title is mandatory"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is mandatory"],
            trim: true,
        },
        type: {
            type: String,
            enum: ["Full-Time", "Part-Time", "Internship", "Remote", "Hybrid"],
            default: "Full-Time",
        },
        experience: {
            type: String,
            required: [true, "Experience is mandatory"],
            trim: true,
        },
        shortDescription: {
            type: String,
            required: [true, "Short Description is mandatory"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is mandatory"],
        },
        responsibilities: {
            type: String,
            default: "",
        },
        eligibility: {
            type: String,
            default: "",
        },
        benefits: {
            type: String,
            default: "",
        },
        salary: {
            type: String,
            default: "",
            trim: true,
        },
        companyInfo: {
            type: String,
            default: "",
        },
        applyLink: {
            type: String,
            default: "",
            trim: true,
        },
        deadline: {
            type: Date,
            required: [true, "Deadline is mandatory"],
        },
        vacancies: {
            type: Number,
            default: 1,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        status: {
            type: Boolean,
            default: true,
        },
        skills: [
            {
                type: String,
                trim: true,
            },
        ],
        companyLogo: {
            type: String,
            default: "",
        },
        location: {
            address: { type: String, default: "", trim: true },
            city: { type: String, required: [true, "City is mandatory"], trim: true },
            state: { type: String, required: [true, "State is mandatory"], trim: true },
            pin: { type: String, default: "", trim: true },
            lat: { type: Number, default: null },
            lng: { type: Number, default: null },
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicating the same job role for the same company
PlacementSchema.index({ companyName: 1, jobTitle: 1 }, { unique: true });

module.exports = mongoose.model("Placement", PlacementSchema);