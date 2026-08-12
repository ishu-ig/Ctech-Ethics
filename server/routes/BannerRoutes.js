const BannerRouter = require("express").Router()
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication")
const { bannerUploader } = require("../middleware/fileuploader")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/BannerController")

BannerRouter.post("", bannerUploader.single("image"), createRecord)
BannerRouter.get("", getRecord)
BannerRouter.get("/:_id", getSingleRecord)
BannerRouter.put("/:_id", bannerUploader.single("image"), updateRecord)
BannerRouter.delete("/:_id", deleteRecord)

module.exports = BannerRouter