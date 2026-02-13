import { Router } from "express";
import { SuccessResponse } from "../../common/utils/responce/index.js";
import { createNote, updateNote } from "./notes.service.js";

const router = Router()


router.post('/', async (req, res) => {
    await createNote(req.headers, req.body)
    return SuccessResponse({ res, message: "Note created", status: 201 })
})


router.patch('/:notedId', async (req, res) => {
    let updatedNote = await updateNote(req.headers,req.body,req.params.notedId)
    return SuccessResponse({ res, message: "Note updated", status: 201, data: updatedNote })
})



export default router
