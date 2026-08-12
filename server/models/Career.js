const mongoose = require("mongoose");

const CareerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is mandatory"],
            trim: true,
        },

        department: {
            type: String,
            required: [true, "Department is mandatory"],
            trim: true,
        },

        type: {
            type: String,
            enum: [
                "Full-Time",
                "Part-Time",
                "Internship",
                "Remote",
                "Hybrid",
            ],
            required: [true, "Job type is mandatory"],
        },

        experience: {
            type: String,
            required: [true, "Experience is mandatory"],
            trim: true,
        },

        shortDescription: {
            type: String,
            required: [true, "Short description is mandatory"],
            trim: true,
        },

        description: {
            type: String,
            required: [true, "Description is mandatory"],
            trim: true,
        },

        location: {
            lat: {
                type: Number,
                default: null,
            },
            lng: {
                type: Number,
                default: null,
            },
            address: {
                type: String,
                default: "",
                trim: true,
            },
            city: {
                type: String,
                required: [true, "City is mandatory"],
                trim: true,
            },
            state: {
                type: String,
                required: [true, "State is mandatory"],
                trim: true,
            },
            pin: {
                type: String,
                default: "",
                trim: true,
            },
        },

        salary: {
            type: String,
            default: "",
            trim: true,
        },

        responsibilities: {
            type: String,
            default: "",
        },

        eligibility: {
            type: String,
            default: "",
        },

        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        benefits: {
            type: String,
            default: "",
        },

        postedDate: {
            type: Date,
            default: Date.now,
        },

        deadline: {
            type: Date,
            required: [true, "Application deadline is mandatory"],
        },

        vacancies: {
            type: Number,
            default: 1,
            min: 1,
        },

        featured: {
            type: Boolean,
            default: false,
        },

        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Career", CareerSchema);