const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema({
    icon: { type: String, trim: true },
    title: { type: String, trim: true },
    desc: { type: String, trim: true }
}, { _id: false });

const ServiceSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, "Title is mandatory"], trim: true },
        slug: { type: String, required: [true, "Slug is mandatory"], unique: true, trim: true, lowercase: true },
        icon: { type: String, required: true, trim: true },
        gradient: { type: String, default: "linear-gradient(135deg, #47b2e4, #2563eb)" },
        image: { type: String, required: [true, "Main image is mandatory"] },
        description: { type: String, required: true, trim: true },
        tagline: { type: String, trim: true },

        overview: {
            heading: { type: String, trim: true, default: "" },
            paragraphs: [{ type: String, trim: true }],
            stats: [{
                value: { type: String, trim: true },
                label: { type: String, trim: true }
            }]
        },

        // Features embedded back into Service
        features: [FeatureSchema],

        status: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);