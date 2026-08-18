const ConsultancyRouter = require("express").Router();
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/ConsultancyController");

ConsultancyRouter.post("", createRecord);
ConsultancyRouter.get("", getRecord);
ConsultancyRouter.get("/:_id", getSingleRecord);
ConsultancyRouter.put("/:_id", updateRecord);
ConsultancyRouter.delete("/:_id", deleteRecord);

module.exports = ConsultancyRouter;
