const BlogRouter = require("express").Router();
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication");
const { blogUploader } = require("../middleware/fileuploader");
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    addComment
} = require("../controllers/BlogController");

// Configure multer to accept multiple specific fields for the Blog
const uploadFields = blogUploader.fields([
    { name: 'image', maxCount: 1 },
    { name: 'authorAvatar', maxCount: 1 }
]);

BlogRouter.post("", uploadFields, createRecord);
BlogRouter.get("", getRecord);
BlogRouter.get("/:_id", getSingleRecord);
BlogRouter.put("/:_id", uploadFields, updateRecord);
BlogRouter.delete("/:_id", deleteRecord);

// Route for adding a comment to a specific blog post
BlogRouter.post("/:_id/comment", addComment);

module.exports = BlogRouter;