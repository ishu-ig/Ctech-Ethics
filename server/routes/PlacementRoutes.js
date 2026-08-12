const PlacementRouter = require("express").Router()
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/PlacementContoller")
const { placementUpload } = require("../middleware/fileuploader")

PlacementRouter.post("", placementUpload.single("companyLogo"), createRecord)
PlacementRouter.get("", getRecord)
PlacementRouter.get("/:_id", getSingleRecord)
PlacementRouter.put("/:_id", placementUpload.single("companyLogo"), updateRecord)
PlacementRouter.delete("/:_id", deleteRecord)

module.exports = PlacementRouter