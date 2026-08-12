const UserRouter = require("express").Router()
// const { verifyBoth, verifyAdmin } = require("../middleware/authentication")
const { userUploader } = require("../middleware/fileuploader")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    login,
    forgetPassword1,
    forgetPassword2,
    forgetPassword3,
} = require("../controllers/UserController")

UserRouter.post(
    "",
    userUploader.fields([
        { name: "pic", maxCount: 1 },
        { name: "resume", maxCount: 1 }
    ]),

    createRecord
)
UserRouter.get("", getRecord)
UserRouter.get("/:_id", getSingleRecord)
UserRouter.put("/:_id",
    userUploader.fields([
        { name: "pic", maxCount: 1 },
        { name: "resume", maxCount: 1 }
    ]), updateRecord
)
UserRouter.delete("/:_id", deleteRecord)
UserRouter.post("/login", login)
UserRouter.post("/forgetPassword-1", forgetPassword1)
UserRouter.post("/forgetPassword-2", forgetPassword2)
UserRouter.post("/forgetPassword-3", forgetPassword3)




module.exports = UserRouter