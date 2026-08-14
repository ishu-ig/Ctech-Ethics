const Note = require("../models/Note");

async function createRecord(req, res) {
    try {
        const { title, content, category, priority, color, isPinned, active } = req.body;

        if (!title || !content)
            return res.status(400).json({ result: "Fail", reason: "Title and content are required." });

        const data = await Note.create({ title, content, category, priority, color, isPinned, active });
        res.status(201).json({ result: "Done", data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ result: "Fail", reason: err.message });
    }
}

async function getRecord(req, res) {
    try {
        const data = await Note.find().sort({ isPinned: -1, createdAt: -1 });
        res.status(200).json({ result: "Done", count: data.length, data });
    } catch (err) {
        res.status(500).json({ result: "Fail", reason: err.message });
    }
}

async function getSingleRecord(req, res) {
    try {
        const data = await Note.findById(req.params._id);
        if (!data) return res.status(404).json({ result: "Fail", reason: "Note not found." });
        res.status(200).json({ result: "Done", data });
    } catch (err) {
        res.status(500).json({ result: "Fail", reason: err.message });
    }
}

async function updateRecord(req, res) {
    try {
        const data = await Note.findById(req.params._id);
        if (!data) return res.status(404).json({ result: "Fail", reason: "Note not found." });

        const fields = ["title", "content", "category", "priority", "color", "isPinned", "active"];
        fields.forEach(f => { if (req.body[f] !== undefined) data[f] = req.body[f]; });

        const updated = await data.save();
        res.status(200).json({ result: "Done", data: updated });
    } catch (err) {
        res.status(500).json({ result: "Fail", reason: err.message });
    }
}

async function deleteRecord(req, res) {
    try {
        const data = await Note.findByIdAndDelete(req.params._id);
        if (!data) return res.status(404).json({ result: "Fail", reason: "Note not found." });
        res.status(200).json({ result: "Done", data });
    } catch (err) {
        res.status(500).json({ result: "Fail", reason: err.message });
    }
}

module.exports = { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord };
