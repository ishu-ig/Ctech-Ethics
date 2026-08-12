const mongoose = require('mongoose');
const BannerSchema = new mongoose.Schema(
    {
        badge: {
            type: String,
            required: [true, "Badge is mandatory"],
            trim: true,
        },
        headline: {
            type: String,
            required: [true, "Headline is mandatory"],
            trim: true,
        },
        tagline: {
            type: String,
            required: [true, "Tagline is mandatory"],
            trim: true,
        },
        body: {
            type: String,
            required: [true, "Body text is mandatory"],
            trim: true,
        },
        accent: {
            type: String,
            required: [true, "Accent color is mandatory"],
            trim: true,
            default: "#47b2e4",
        },
        image: {
            type: String,
            required: [true, "Image is mandatory"],
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

module.exports = mongoose.model("Banner", BannerSchema);