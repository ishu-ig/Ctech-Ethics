const mongoose = require("mongoose");
const { deleteFromCloudinary } = require("../cloudinaryMethods");
const Blog = require("../models/Blog");

// Helper to safely parse tags array from FormData
const parseTags = (body) => {
    if (body.tags) return Array.isArray(body.tags) ? body.tags : [body.tags];
    if (body["tags[]"]) return Array.isArray(body["tags[]"]) ? body["tags[]"] : [body["tags[]"]];
    return [];
};

// Helper to safely parse the sections array (sent as a JSON string in FormData)
const parseSections = (body) => {
    if (!body.sections) return [];
    try {
        return typeof body.sections === "string" ? JSON.parse(body.sections) : body.sections;
    } catch {
        return [];
    }
};

// Flatten structured sections into the HTML string the public site renders
const buildContentFromSections = (sections) =>
    sections
        .map((s) => {
            let html = "";
            if (s.subheading) html += `<h2>${s.subheading}</h2>`;
            if (Array.isArray(s.paragraphs)) html += s.paragraphs.join("");
            return html;
        })
        .join("");

// Create Blog
async function createRecord(req, res) {
    try {
        const sections = parseSections(req.body);
        const data = new Blog({
            title: req.body.title,
            slug: req.body.slug,
            category: req.body.category,
            categoryColor: req.body.categoryColor,
            summary: req.body.summary,
            sections,
            content: req.body.content || buildContentFromSections(sections),
            readTime: req.body.readTime,
            featured: req.body.featured,
            active: req.body.active !== undefined ? req.body.active : true,
            tags: parseTags(req.body),
            author: {
                name: req.body.authorName || req.body.author,
                role: req.body.authorRole || "",
                bio: req.body.authorBio || "",
            }
        });

        // Handle multiple file uploads
        if (req.files) {
            if (req.files.image) data.image = req.files.image[0].path;
            if (req.files.authorAvatar) data.author.avatar = req.files.authorAvatar[0].path;
        } else if (req.file) {
            data.image = req.file.path; // Fallback for single uploads
        }

        await data.save();

        res.status(201).json({ result: "Done", data });
    } catch (error) {
        // Cleanup files if saving to database fails
        if (req.files) {
            if (req.files.image) await deleteFromCloudinary(req.files.image[0].path);
            if (req.files.authorAvatar) await deleteFromCloudinary(req.files.authorAvatar[0].path);
        }

        const errorMessage = {};
        if (error.code === 11000) errorMessage.slug = "This URL Slug is already taken.";
        if (error.errors) {
            Object.keys(error.errors).forEach((key) => {
                errorMessage[key] = error.errors[key].message;
            });
        }

        res.status(Object.keys(errorMessage).length ? 400 : 500).json({
            result: "Fail",
            reason: Object.keys(errorMessage).length ? errorMessage : "Internal Server Error",
        });
    }
}

// Get All Blogs
async function getRecord(req, res) {
    try {
        const data = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json({ result: "Done", count: data.length, data });
    } catch (error) {
        res.status(500).json({ result: "Fail", reason: "Internal Server Error" });
    }
}

// Get Single Blog
async function getSingleRecord(req, res) {
    try {
        // Allow fetching by ID or Slug
        const query = mongoose.isValidObjectId(req.params.identifier)
            ? { _id: req.params.identifier }
            : { slug: req.params.identifier };

        const data = await Blog.findOne(query);

        if (!data) return res.status(404).json({ result: "Fail", reason: "Record Not Found" });
        res.status(200).json({ result: "Done", data });
    } catch (error) {
        res.status(500).json({ result: "Fail", reason: "Internal Server Error" });
    }
}

// Update Blog
async function updateRecord(req, res) {
    try {
        const data = await Blog.findById(req.params._id);
        if (!data) return res.status(404).json({ result: "Fail", reason: "Record Not Found" });

        // Handle File Updates (Delete old file from Cloudinary if new one is provided)
        if (req.files) {
            if (req.files.image) {
                if (data.image) await deleteFromCloudinary(data.image);
                data.image = req.files.image[0].path;
            }
            if (req.files.authorAvatar) {
                if (data.author.avatar) await deleteFromCloudinary(data.author.avatar);
                data.author.avatar = req.files.authorAvatar[0].path;
            }
        }

        // Update properties
        data.title = req.body.title || data.title;
        data.slug = req.body.slug || data.slug;
        data.category = req.body.category || data.category;
        data.categoryColor = req.body.categoryColor || data.categoryColor;
        data.summary = req.body.summary || data.summary;
        data.content = req.body.content || data.content;
        data.readTime = req.body.readTime || data.readTime;
        data.featured = req.body.featured !== undefined ? req.body.featured : data.featured;
        data.active = req.body.active !== undefined ? req.body.active : data.active;

        if (req.body.sections) {
            const sections = parseSections(req.body);
            data.sections = sections;
            data.content = req.body.content || buildContentFromSections(sections);
        }

        if (req.body.tags || req.body["tags[]"]) data.tags = parseTags(req.body);

        if (req.body.authorName) data.author.name = req.body.authorName;
        if (req.body.authorRole !== undefined) data.author.role = req.body.authorRole;
        if (req.body.authorBio !== undefined) data.author.bio = req.body.authorBio;

        await data.save();
        res.status(200).json({ result: "Done", data });
    } catch (error) {
        // Cleanup newly uploaded files if save fails
        if (req.files) {
            if (req.files.image) await deleteFromCloudinary(req.files.image[0].path);
            if (req.files.authorAvatar) await deleteFromCloudinary(req.files.authorAvatar[0].path);
        }

        const errorMessage = {};
        if (error.code === 11000) errorMessage.slug = "This URL Slug is already taken.";
        if (error.errors) {
            Object.keys(error.errors).forEach((key) => {
                errorMessage[key] = error.errors[key].message;
            });
        }

        res.status(Object.keys(errorMessage).length ? 400 : 500).json({
            result: "Fail",
            reason: Object.keys(errorMessage).length ? errorMessage : "Internal Server Error",
        });
    }
}

// Delete Blog
async function deleteRecord(req, res) {
    try {
        const data = await Blog.findById(req.params._id);
        if (!data) return res.status(404).json({ result: "Fail", reason: "Record Not Found" });

        // Cleanup files
        if (data.image) await deleteFromCloudinary(data.image);
        if (data.author && data.author.avatar) await deleteFromCloudinary(data.author.avatar);

        await data.deleteOne();
        res.status(200).json({ result: "Done", data });
    } catch (error) {
        res.status(500).json({ result: "Fail", reason: "Internal Server Error" });
    }
}

// Add Comment
async function addComment(req, res) {
    try {
        const data = await Blog.findById(req.params._id);
        if (!data) return res.status(404).json({ result: "Fail", reason: "Record Not Found" });

        data.comments.unshift({
            name: req.body.name,
            email: req.body.email,
            body: req.body.body,
        });

        await data.save();
        res.status(201).json({ result: "Done", data: data.comments[0] });
    } catch (error) {
        res.status(500).json({ result: "Fail", reason: "Internal Server Error" });
    }
}

module.exports = {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    addComment,
};