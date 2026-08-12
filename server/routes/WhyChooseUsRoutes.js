const WhyChooseUsRouter = require("express").Router()
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication")

const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/WhyChooseUsController")

WhyChooseUsRouter.post("", createRecord)
WhyChooseUsRouter.get("", getRecord)
WhyChooseUsRouter.get("/:_id", getSingleRecord)
WhyChooseUsRouter.put("/:_id", updateRecord)
WhyChooseUsRouter.delete("/:_id", deleteRecord)

module.exports = WhyChooseUsRouter