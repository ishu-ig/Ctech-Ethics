const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is mandatory"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is mandatory"],
            trim: true,
        },
        // CHANGED: Now an array of strings to store multiple images
        images: [
            {
                type: String,
                required: [true, "At least one image is mandatory"],
            }
        ],
        desc: {
            type: String,
            required: [true, "Description is mandatory"],
            trim: true,
        },
        tech: [
            {
                icon: { type: String, trim: true, required: true },
                color: { type: String, trim: true, default: "#6ea8ff" },
            },
        ],
        link: {
            type: String,
            trim: true,
            default: "",
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

// Prevent exact duplicate project names
PortfolioSchema.index({ title: 1 }, { unique: true });

module.exports = mongoose.model("Portfolio", PortfolioSchema);