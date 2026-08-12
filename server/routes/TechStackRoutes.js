const TechStackRouter = require("express").Router()
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/TechStackController")

TechStackRouter.post("", createRecord)
TechStackRouter.get("", getRecord)
TechStackRouter.get("/:_id", getSingleRecord)
TechStackRouter.put("/:_id", updateRecord)
TechStackRouter.delete("/:_id", deleteRecord)

module.exports = TechStackRouter