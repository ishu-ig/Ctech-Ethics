const ApplicationRouter = require("express").Router()
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication")
const { applicationUploader } = require("../middleware/fileuploader")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/ApplicationController")

ApplicationRouter.post("", applicationUploader.single("resume"), createRecord)
ApplicationRouter.get("", getRecord)
ApplicationRouter.get("/:_id", getSingleRecord)
ApplicationRouter.put("/:_id", applicationUploader.single("resume"), updateRecord)
ApplicationRouter.delete("/:_id", deleteRecord)

module.exports = ApplicationRouter