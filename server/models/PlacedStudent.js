const mongoose = require('mongoose');

const PlacedStudentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Student name is required"],
            trim: true
        },
        role: {
            type: String,
            required: [true, "Job role is required"],
            trim: true
        },
        company: {
            type: String,
            required: [true, "Company name is required"],
            trim: true
        },
        companyIcon: {
            type: String,
            default: "bi-building",
            trim: true
        },
        type: {
            type: String,
            required: true,
            enum: ['Technical', 'Non-Technical'],
            default: 'Technical'
        },
        package: {
            type: String,
            required: [true, "Package details are required"],
            trim: true
        },
        photo: {
            type: String,
            required: [true, "Student photo is required"]
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("PlacedStudent", PlacedStudentSchema);