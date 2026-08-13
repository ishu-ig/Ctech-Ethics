const PlacementApplicationRouter = require("express").Router()
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication")
const { placementApplicationUploader } = require("../middleware/fileuploader")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/PlacementApplicationController")

PlacementApplicationRouter.post("", placementApplicationUploader.single("resume"), createRecord)
PlacementApplicationRouter.get("", getRecord)
PlacementApplicationRouter.get("/:_id", getSingleRecord)
PlacementApplicationRouter.put("/:_id", placementApplicationUploader.single("resume"), updateRecord)
PlacementApplicationRouter.delete("/:_id", deleteRecord)

module.exports = PlacementApplicationRouter