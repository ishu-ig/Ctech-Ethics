const NoteRouter = require("express").Router();
const { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require("../controllers/NoteController");

NoteRouter.post("",        createRecord);
NoteRouter.get("",         getRecord);
NoteRouter.get("/:_id",    getSingleRecord);
NoteRouter.put("/:_id",    updateRecord);
NoteRouter.delete("/:_id", deleteRecord);

module.exports = NoteRouter;
