const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema(
    {
        icon: {
            type: String,
            required: [true, "Icon is mandatory"],
            trim: true,
        },

        count: {
            type: String,
            required: [true, "Count is mandatory"],
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

        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Achievement", AchievementSchema);