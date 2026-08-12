const ServiceRouter = require("express").Router()
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication")
const { serviceUploader } = require("../middleware/fileuploader")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/ServiceController")

ServiceRouter.post("", serviceUploader.single("image"), createRecord)
ServiceRouter.get("", getRecord)
ServiceRouter.get("/:_id", getSingleRecord)
ServiceRouter.put("/:_id", serviceUploader.single("image"), updateRecord)
ServiceRouter.delete("/:_id", deleteRecord)

module.exports = ServiceRouter