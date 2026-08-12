const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is mandatory"],
            trim: true,
        },

        designation: {
            type: String,
            required: [true, "Designation is mandatory"],
            trim: true,
        },

        company: {
            type: String,
            default: "",
            trim: true,
        },

        message: {
            type: String,
            required: [true, "Message is mandatory"],
            trim: true,
        },

        pic: {
            type: String,
            required: [true, "Profile image is mandatory"],
        },

        rating: {
            type: Number,
            default: 5,
            min: 1,
            max: 5,
        },

        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Testimonial", TestimonialSchema);