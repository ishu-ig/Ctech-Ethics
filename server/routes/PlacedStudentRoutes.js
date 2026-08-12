const PlacedStudentRouter = require("express").Router()
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication")
const { placedStudentUploader } = require("../middleware/fileuploader")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/PlacedStudentController")

PlacedStudentRouter.post("", placedStudentUploader.single("photo"), createRecord)
PlacedStudentRouter.get("", getRecord)
PlacedStudentRouter.get("/:_id", getSingleRecord)
PlacedStudentRouter.put("/:_id", placedStudentUploader.single("photo"), updateRecord)
PlacedStudentRouter.delete("/:_id", deleteRecord)

module.exports = PlacedStudentRouter