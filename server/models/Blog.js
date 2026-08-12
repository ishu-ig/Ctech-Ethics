const mongoose = require("mongoose");

// Sub-schema for Comments
const CommentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, trim: true, default: "" },
        body: { type: String, required: true, trim: true },
        likes: { type: Number, default: 0 },
        status: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

// Main Blog Schema
const BlogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is mandatory"],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, "Slug is mandatory"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        category: {
            type: String,
            required: [true, "Category is mandatory"],
            trim: true,
        },
        categoryColor: {
            type: String,
            default: "#47b2e4",
        },
        image: {
            type: String,
            required: [true, "Featured image is mandatory"],
        },
        summary: {
            type: String,
            required: [true, "Summary is mandatory"],
            trim: true,
        },
        // Structured content as built by the admin "Content Sections" UI —
        // kept alongside `content` so the Update form can load a post back
        // into subheading/paragraph blocks instead of one opaque HTML blob.
        sections: [
            {
                subheading: { type: String, trim: true, default: "" },
                paragraphs: [{ type: String }],
                _id: false,
            },
        ],
        // Flattened HTML built from `sections` — this is what the public
        // site actually renders.
        content: {
            type: String,
            required: [true, "Content is mandatory"],
        },
        readTime: {
            type: String,
            default: "5 min read",
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        author: {
            name: { type: String, required: true, trim: true },
            role: { type: String, default: "", trim: true },
            avatar: { type: String, default: "" },
            bio: { type: String, default: "" },
        },
        comments: [CommentSchema],
        featured: {
            type: Boolean,
            default: false,
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

module.exports = mongoose.model("Blog", BlogSchema);