const mongoose = require("mongoose");

const WhyChooseUsSchema = new mongoose.Schema(
    {
        icon: {
            type: String,
            required: [true, "Icon is mandatory"],
            trim: true,
        },

        badge: {
            type: String,
            required: [true, "Badge is mandatory"],
            trim: true,
        },

        title: {
            type: String,
            required: [true, "Title is mandatory"],
            trim: true,
        },

        description: {
            type: String,
            required: [true, "Description is mandatory"],
            trim: true,
        },

        order: {
            type: Number,
            default: 1,
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

module.exports = mongoose.model("WhyChooseUs", WhyChooseUsSchema);