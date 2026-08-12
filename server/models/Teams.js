const mongoose = require("mongoose");

const TeamsSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: [true, "Image is mandatory"],
        },

        name: {
            type: String,
            required: [true, "Name is mandatory"],
            trim: true,
        },

        role: {
            type: String,
            required: [true, "Role is mandatory"],
            trim: true,
        },

        badge: {
            type: String,
            required: [true, "Badge is mandatory"],
            trim: true,
        },

        bio: {
            type: String,
            required: [true, "Bio is mandatory"],
            trim: true,
        },

        skills: [
            {
                type: String,
                trim: true,
            }
        ],

        social: {
            twitter: {
                type: String,
                default: "",
            },
            facebook: {
                type: String,
                default: "",
            },
            instagram: {
                type: String,
                default: "",
            },
            linkedin: {
                type: String,
                default: "",
            },
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

module.exports = mongoose.model("Team", TeamsSchema);