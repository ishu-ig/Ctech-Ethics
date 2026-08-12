const mongoose = require("mongoose");

const TechStackSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is mandatory"],
            trim: true,
            unique: true, // Prevents duplicate tech stack entries
        },
        icon: {
            type: String,
            required: [true, "Icon is mandatory"],
            trim: true,
        },
        color: {
            type: String,
            default: "#6ea8ff",
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

module.exports = mongoose.model("TechStack", TechStackSchema);