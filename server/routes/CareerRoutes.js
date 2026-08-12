const CareerRouter = require("express").Router()
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/CareerController")

CareerRouter.post("", createRecord)
CareerRouter.get("", getRecord)
CareerRouter.get("/:_id", getSingleRecord)
CareerRouter.put("/:_id", updateRecord)
CareerRouter.delete("/:_id", deleteRecord)

module.exports = CareerRouter
