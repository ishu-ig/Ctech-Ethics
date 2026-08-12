const mongoose = require("mongoose");

const SubServiceSchema = new mongoose.Schema({
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    status: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("SubService", SubServiceSchema);