const SubServiceRouter = require("express").Router()
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/SubServiceController")

SubServiceRouter.post("", createRecord)
SubServiceRouter.get("", getRecord)
SubServiceRouter.get("/:_id", getSingleRecord)
SubServiceRouter.put("/:_id", updateRecord)
SubServiceRouter.delete("/:_id", deleteRecord)

module.exports = SubServiceRouter