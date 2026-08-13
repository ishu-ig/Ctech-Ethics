const mongoose = require("mongoose");

const PlacementApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is mandatory"],
        trim: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Placement",
        default: null
    },
    email: {
        type: String,
        required: [true, "Email is mandatory"],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, "Phone number is mandatory"],
        trim: true
    },
    message: {
        type: String,
        trim: true
    },
    resume: {
        type: String,
        required: [true, "Resume document is mandatory"]
    },
    status: {
        type: String,
        enum: ["Pending", "Reviewed", "Shortlisted", "Rejected"],
        default: "Pending"
    }
}, { timestamps: true });

module.exports = new mongoose.model("PlacementApplication", PlacementApplicationSchema);