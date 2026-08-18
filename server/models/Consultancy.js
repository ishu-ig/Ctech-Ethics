const mongoose = require("mongoose");

const ConsultancySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Full name is mandatory"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"]
    },
    email: {
        type: String,
        required: [true, "Email address is mandatory"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is mandatory"],
        trim: true,
        minlength: [7, "Phone number must be at least 7 digits"]
    },
    service: {
        type: String,
        required: [true, "Service required is mandatory"],
        trim: true
    },
    budget: {
        type: String,
        required: [true, "Project budget is mandatory"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Project description is mandatory"],
        trim: true,
        minlength: [10, "Description must be at least 10 characters long"]
    },
    status: {
        type: String,
        enum: ["Pending", "Contacted", "In Progress", "Completed", "Cancelled"],
        default: "Pending"
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Consultancy = mongoose.model("Consultancy", ConsultancySchema);

module.exports = Consultancy;
