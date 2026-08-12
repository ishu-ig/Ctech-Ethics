const TeamsRouter = require("express").Router()
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication")
const { teamsUploader } = require("../middleware/fileuploader")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/TeamsController")

TeamsRouter.post("", teamsUploader.single("image"), createRecord)
TeamsRouter.get("", getRecord)
TeamsRouter.get("/:_id", getSingleRecord)
TeamsRouter.put("/:_id", teamsUploader.single("image"), updateRecord)
TeamsRouter.delete("/:_id", deleteRecord)

module.exports = TeamsRouter