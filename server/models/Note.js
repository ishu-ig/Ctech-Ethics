const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is mandatory"],
            trim: true,
        },
        content: {
            type: String,
            required: [true, "Content is mandatory"],
            trim: true,
        },
        category: {
            type: String,
            enum: ["Work", "Ideas", "Architecture", "Personal", "Todo", "Other"],
            default: "Work",
        },
        priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            default: "Medium",
        },
        color: {
            type: String,
            default: "#6366f1",   // accent color for the note card
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
