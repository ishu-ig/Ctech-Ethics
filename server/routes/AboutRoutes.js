const AboutRouter = require("express").Router()
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication")
const { aboutUploader } = require("../middleware/fileuploader")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/AboutController")

AboutRouter.post("", aboutUploader.single("image"), createRecord)
AboutRouter.get("", getRecord)
AboutRouter.get("/:_id", getSingleRecord)
AboutRouter.put("/:_id", aboutUploader.single("image"), updateRecord)
AboutRouter.delete("/:_id", deleteRecord)

module.exports = AboutRouter