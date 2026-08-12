const TestimonialRouter = require("express").Router()
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication")
const { testimonialUploader } = require("../middleware/fileuploader")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/TestimonialController")

TestimonialRouter.post("", testimonialUploader.single("pic"), createRecord)
TestimonialRouter.get("", getRecord)
TestimonialRouter.get("/:_id", getSingleRecord)
TestimonialRouter.put("/:_id", testimonialUploader.single("pic"), updateRecord)
TestimonialRouter.delete("/:_id", deleteRecord)

module.exports = TestimonialRouter