const AchievementRouter = require("express").Router()
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/AchievementController")

AchievementRouter.post("", createRecord)
AchievementRouter.get("", getRecord)
AchievementRouter.get("/:_id", getSingleRecord)
AchievementRouter.put("/:_id", updateRecord)
AchievementRouter.delete("/:_id", deleteRecord)

module.exports = AchievementRouter