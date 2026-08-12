const PortfolioRouter = require("express").Router()
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication")
const { portfolioUploader } = require("../middleware/fileuploader")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/PortfolioController")

PortfolioRouter.post("", portfolioUploader.array("images", 5), createRecord)
PortfolioRouter.get("", getRecord)
PortfolioRouter.get("/:_id", getSingleRecord)
PortfolioRouter.put("/:_id", portfolioUploader.array("images", 5), updateRecord)
PortfolioRouter.delete("/:_id", deleteRecord)

module.exports = PortfolioRouter